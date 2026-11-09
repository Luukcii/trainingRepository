// Turns one Discord slash command into God's reply (his words live in voice.ts). Reading commands are open to everyone in the server, but
// kingdom details only reach that kingdom's members (and staff), as private replies;
// /warstaff commands check staff rights here on our server, every time.
import { z } from "zod";
import { factionIds, factions, findTerritory, matchTerritory, territories, type FactionId } from "@/content/war/map";
import { findTerm, glossary } from "@/content/war/glossary";
import { stripMarkup } from "@/lib/war/markup";
import { isAnnouncement, loadWarState } from "@/lib/war/state";
import { createWarAccount, factionOfDiscordUser, isSiteWarStaff, resetWarPassword } from "@/lib/war/accounts";
import { god } from "./voice";
import { answerQuestion, askConfigured, askUsageToday, checkAskLimit, followUpTarget, getGodMind, godMinds, QUESTION_MAX, reserveQuestion } from "./ask";
import { tierNames, type Tier, type WarViewer } from "@/lib/war/types";
import {
  changeStat,
  getTerritoryRow,
  isWarSetUp,
  recentEvents,
  recordGodMind,
  recordRuling,
  resolveMovement,
  revealMovement,
  setDay,
  setUpWar,
  startMovement,
  statKeys,
  updateTerritory,
} from "@/lib/war/record";

// Discord's message types and flags (see Discord's "Interactions" docs).
export const PING = 1;
const COMMAND = 2;
const AUTOCOMPLETE = 4;
const REPLY = 4;
const AUTOCOMPLETE_RESULT = 8;
const THINKING = 5; // "God is thinking…": we fill in the real reply a moment later
const EPHEMERAL = 64; // only the person who ran the command sees the reply

const ADMINISTRATOR = BigInt(1 << 3);
const MANAGE_GUILD = BigInt(1 << 5);

type Option = { name: string; type: number; value?: string | number | boolean; focused?: boolean; options?: Option[] };
export type Interaction = {
  type: number;
  guild_id?: string;
  application_id?: string;
  token?: string; // lets us edit our reply for 15 minutes (used by /war ask)
  data?: { name: string; options?: Option[] };
  member?: { user: { id: string; username?: string; global_name?: string | null }; permissions?: string; roles?: string[]; nick?: string | null };
};

const siteUrl = () => (process.env.BETTER_AUTH_URL ?? "https://training-repository-ten.vercel.app").replace(/\/$/, "");
const fmt = (n: number) => n.toLocaleString("en");
const color = (f: FactionId) => parseInt(factions[f].color.slice(1), 16);
const joinUrl = (username: string) => `${siteUrl()}/war/join?name=${encodeURIComponent(username)}`;
const plain = (text: string) => stripMarkup(text, (id) => findTerm(id)?.term ?? id);

// Every reply goes out with mentions switched off: text typed into a command (a cargo note, a reason)
// can't ping @everyone or a role when the bot repeats it.
function reply(content: string, opts: { private?: boolean; embeds?: object[] } = {}) {
  return {
    type: REPLY,
    data: { content, embeds: opts.embeds ?? [], flags: opts.private ? EPHEMERAL : 0, allowed_mentions: { parse: [] } },
  };
}

class InputError extends Error {}

// Reads one option and checks it, even though Discord already checked: never trust the input.
function reader(options: Option[] = []) {
  const raw = (name: string) => options.find((o) => o.name === name)?.value;
  const get = <T>(name: string, schema: z.ZodType<T>): T => {
    const result = schema.safeParse(raw(name));
    if (!result.success) throw new InputError(god.badInput(name));
    return result.data;
  };
  return {
    text: (name: string, max = 100) => get(name, z.string().trim().max(max).optional()) ?? "",
    int: (name: string, min: number, max: number) => get(name, z.number().int().min(min).max(max).optional()),
    num: (name: string, min: number, max: number) => get(name, z.number().min(min).max(max).optional()),
    bool: (name: string) => get(name, z.boolean().optional()),
    kingdom: (name = "kingdom") => get(name, z.enum(factionIds).optional()),
    choice: <T extends string>(name: string, allowed: readonly [T, ...T[]]) => get(name, z.enum(allowed).optional()),
    place: (name: string) => {
      const value = get(name, z.string().trim().min(1).max(60).optional());
      const t = value ? matchTerritory(value) : undefined;
      if (!t) throw new InputError(god.unknownPlace(value ?? ""));
      return t;
    },
  };
}

// Staff = Discord admins / "Manage Server", the optional WAR_STAFF_ROLE_ID role, or anyone Max made a Mod or
// Tech on the site (/admin). Checked here on our server every time.
async function isStaff(member: Interaction["member"]): Promise<boolean> {
  if (!member) return false;
  const perms = BigInt(member.permissions ?? "0");
  if ((perms & ADMINISTRATOR) !== BigInt(0) || (perms & MANAGE_GUILD) !== BigInt(0)) return true;
  const staffRole = process.env.WAR_STAFF_ROLE_ID;
  if (staffRole && member.roles?.includes(staffRole)) return true;
  return isSiteWarStaff(member.user.id);
}

// Work to finish after Discord has its quick reply (the website passes Next.js's after()).
export type Defer = (work: () => Promise<void>) => void;

export async function handleInteraction(interaction: Interaction, defer?: Defer) {
  // Only our own server. Anyone could add a bot to their server, where they are admin: without this check,
  // they could run /warstaff there and rewrite our war.
  if (interaction.guild_id !== process.env.DISCORD_GUILD_ID) {
    return reply(god.wrongServer, { private: true });
  }

  const sub = interaction.data?.options?.[0];
  if (!interaction.data || !sub) return reply(god.unknown, { private: true });

  if (interaction.type === AUTOCOMPLETE) return autocomplete(sub.options ?? []);
  if (interaction.type !== COMMAND) return reply(god.unknown, { private: true });

  try {
    if (interaction.data.name === "war") return await publicCommand(sub, interaction, defer);
    if (interaction.data.name === "warstaff") {
      if (!(await isStaff(interaction.member))) return reply(god.staffOnly, { private: true });
      return await staffCommand(sub, interaction.member!.user.id);
    }
    return reply(god.unknown, { private: true });
  } catch (error) {
    if (error instanceof InputError) return reply(error.message, { private: true });
    console.error("discord command failed:", interaction.data.name, sub.name, error instanceof Error ? error.name : "unknown");
    return reply(god.failed, { private: true });
  }
}

function autocomplete(options: Option[]) {
  const focused = options.find((o) => o.focused);
  const typed = String(focused?.value ?? "").toLowerCase();
  const choices =
    focused?.name === "term"
      ? glossary.filter((g) => g.term.toLowerCase().includes(typed)).map((g) => ({ name: g.term, value: g.id }))
      : territories
          .filter((t) => t.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(typed.normalize("NFD").replace(/[̀-ͯ]/g, "")))
          .map((t) => ({ name: `${t.name}${t.home ? ` (${factions[t.home].name}${t.number ? ` ${t.number}` : ""})` : ""}`, value: t.id }));
  return { type: AUTOCOMPLETE_RESULT, data: { choices: choices.slice(0, 25) } };
}

// Fog of war, the same as on the website: staff see every kingdom; a player sees only the kingdom their
// linked account is sworn to; anyone else is pointed to /war join. Kingdom details always go out as
// private replies, so they never land in a public channel.
const notLinked = () => god.notLinked(`${siteUrl()}/war`);

async function viewerFor(member: Interaction["member"]): Promise<WarViewer> {
  if (!member) return null;
  if (await isStaff(member)) return "all";
  return factionOfDiscordUser(member.user.id);
}

async function publicCommand(sub: Option, interaction: Interaction, defer?: Defer) {
  const member = interaction.member;
  const read = reader(sub.options);
  switch (sub.name) {
    case "ask": {
      if (!member) return reply(god.cantReadAccount, { private: true });
      const question = read.text("question", QUESTION_MAX);
      if (!question) throw new InputError(god.badInput("question"));
      if (!askConfigured() || !defer) return reply(god.askAsleep(`${siteUrl()}/war/rules`), { private: true });
      const mind = await getGodMind();
      if (mind === "off") return reply(god.askSilenced, { private: true });
      const limit = await checkAskLimit(member.user.id, await isStaff(member));
      if (limit !== "ok") return reply(limit === "hour" ? god.askTooMany : god.askRestingToday, { private: true });
      const target = followUpTarget(interaction.application_id, interaction.token);
      if (!target) return reply(god.askFailed, { private: true });
      const id = await reserveQuestion(member.user.id, mind);
      defer(() => answerQuestion(id, question, mind, target));
      return { type: THINKING, data: { flags: EPHEMERAL } }; // only the asker sees "thinking" and the answer
    }
    case "join": {
      // Discord itself tells us who ran the command, so the account is tied to a proven Discord account.
      if (!member?.user.username) return reply(god.cantReadAccount, { private: true });
      const name = member.nick ?? member.user.global_name ?? member.user.username;
      const result = await createWarAccount(member.user.id, member.user.username, name);
      if (result.kind === "exists") return reply(god.alreadyJoined(result.username, `${siteUrl()}/war/login`), { private: true });
      return reply(god.welcome(name, result.username, result.password, joinUrl(result.username)), { private: true });
    }
    case "password": {
      if (!member) return reply(god.cantReadAccount, { private: true });
      const result = await resetWarPassword(member.user.id);
      if (!result) return reply(god.noAccount, { private: true });
      return reply(god.newPassword(result.username, result.password, joinUrl(result.username)), { private: true });
    }
    case "status": {
      const viewer = await viewerFor(member);
      if (!viewer) return reply(notLinked(), { private: true });
      const state = await loadWarState(viewer);
      const chosen = read.kingdom();
      const list = (chosen ? [chosen] : factionIds).filter((f) => state.factions[f]);
      if (list.length === 0) return reply(god.secretNumbers, { private: true });
      const embeds = list.map((f) => {
        const s = state.factions[f]!;
        const held = Object.values(state.territories).filter((t) => t.owner === f).length;
        return {
          title: `${factions[f].name} (${factions[f].people})`,
          color: color(f),
          fields: [
            ["Territories", fmt(held)],
            ["Gold", fmt(s.gold)],
            ["Troops", fmt(s.troops)],
            ["Stone / Lumber", `${fmt(s.stone)} / ${fmt(s.lumber)}`],
            ["Faith", `${fmt(s.faith)} / 25,000 at 20 members`],
            ["Fame", `${fmt(s.fame)} / 21,000 at 20 members`],
            ["Trade", `${fmt(s.trade)} / 425,000`],
            ["AP", fmt(s.ap)],
          ].map(([name, value]) => ({ name, value, inline: true })),
        };
      });
      const note = state.source === "example" ? god.exampleNote : "";
      return reply(`**Day ${state.day} of 30**${note}`, { embeds, private: true });
    }
    case "territory": {
      const t = read.place("name");
      const state = await loadWarState(await viewerFor(member));
      const ts = state.territories[t.id];
      const owner = ts.owner ? factions[ts.owner].name : "Neutral";
      const lines = [
        `Held by **${owner}**${t.home && ts.owner !== t.home ? ` (originally ${factions[t.home].name})` : ""}`,
        t.home ? `Tier: ${tierNames[ts.tier]} · Troops: ${ts.troops === null ? "secret" : fmt(ts.troops)}` : t.note,
        ts.buildings.length ? `Buildings: ${ts.buildings.join(", ")}` : "",
        ts.obstacles.length ? `Obstacles: ${ts.obstacles.join(", ")}` : "",
      ].filter(Boolean);
      return reply("", { private: true, embeds: [{ title: t.name, description: lines.join("\n"), color: ts.owner ? color(ts.owner) : 0xd9b400 }] });
    }
    case "moving": {
      const viewer = await viewerFor(member);
      if (!viewer) return reply(notLinked(), { private: true });
      const state = await loadWarState(viewer);
      const moving = state.movements.filter((m) => m.status === "moving");
      if (moving.length === 0) return reply(god.nothingMoving, { private: true });
      const lines = moving.map((m) => {
        const arrives = Math.floor(Date.parse(m.arrivesAt) / 1000);
        return `\`${m.id}\` ${factions[m.faction].name} ${m.kind}: ${findTerritory(m.from)?.name} → ${findTerritory(m.to)?.name}, arrives <t:${arrives}:R>`;
      });
      return reply(lines.join("\n"), { private: true });
    }
    case "log": {
      const viewer = await viewerFor(member);
      if (!viewer) return reply(notLinked(), { private: true });
      if (!(await isWarSetUp())) return reply(god.notSetUp, { private: true });
      const count = read.int("count", 1, 25) ?? 10;
      const events =
        viewer === "all"
          ? await recentEvents(count, false)
          : (await recentEvents(100, false)).filter((e) => isAnnouncement(e.kind) || e.faction === viewer).slice(0, count);
      return reply(events.map((e) => `<t:${Math.floor(e.at.getTime() / 1000)}:R> ${e.summary}`).join("\n") || god.nothingRecorded, { private: true });
    }
    case "rule": {
      const id = read.text("term", 60);
      const entry = findTerm(id) ?? glossary.find((g) => g.term.toLowerCase() === id.toLowerCase());
      if (!entry) return reply(god.noRule(id, `${siteUrl()}/war/rules`), { private: true });
      const text = [plain(entry.short), ...(entry.more ?? []).map(plain), entry.missing ? `*Not settled yet: ${entry.missing}*` : ""].filter(Boolean).join("\n\n");
      return reply("", { private: true, embeds: [{ title: entry.term, description: text, url: `${siteUrl()}/war/rules#glossary` }] });
    }
    case "map":
      return reply(`⚔️ Faction War: ${siteUrl()}/war
🗺️ War map: ${siteUrl()}/war/map\n📖 Player's guide: ${siteUrl()}/war/rules\n📚 Full rulebook: ${siteUrl()}/war/rules/full`);
  }
  return reply(god.unknown, { private: true });
}

async function staffCommand(sub: Option, actor: string) {
  const read = reader(sub.options);

  if (sub.name === "setup") {
    const started = await setUpWar(actor);
    return started
      ? reply(god.warBegins)
      : reply(god.alreadyBegun, { private: true });
  }
  if (sub.name === "mind") {
    // Works before the war begins too. No choice = just show the current setting and today's use.
    const labels = { off: "nobody (off)", god: "God (quick and cheap)", odin: "Odin (wise, costs more)" } as const;
    const chosen = read.choice("mode", godMinds);
    if (chosen) await recordGodMind(actor, chosen, labels[chosen]);
    const usage = await askUsageToday();
    return reply(god.mindSet(labels[chosen ?? (await getGodMind())], usage.questions, usage.dollars, askConfigured()), { private: true });
  }
  if (!(await isWarSetUp())) return reply(god.setupFirst, { private: true });

  switch (sub.name) {
    case "day": {
      const day = read.int("number", 1, 60)!;
      await setDay(actor, day);
      return reply(god.newDay(day));
    }
    case "adjust":
    case "set": {
      const f = read.kingdom()!;
      const stat = read.choice("stat", statKeys);
      if (!stat) throw new InputError(god.pickStat);
      const mode = sub.name === "set" ? "set" : "add";
      const amount = mode === "set" ? read.int("value", 0, 1_000_000_000)! : read.int("amount", -100_000_000, 100_000_000)!;
      const now = await changeStat(actor, f, stat, amount, mode, read.text("reason"));
      if (now === null) return reply(god.notInWar, { private: true });
      return reply(`${factions[f].name} ${stat}: ${mode === "set" ? "set to " : amount >= 0 ? "+" : ""}${fmt(amount)} → now **${fmt(now)}**. ${god.recorded}`, { private: true });
    }
    case "territory": {
      const t = read.place("name");
      if (!t.home) return reply(god.neutralLocked, { private: true });
      const owner = read.kingdom();
      const tier: Tier | undefined = read.choice("tier", ["town-hall", "castle", "fortress"] as const);
      const troops = read.int("troops", 0, 10_000_000);
      if (!owner && !tier && troops === undefined) return reply(god.tellMeWhat, { private: true });
      const parts = [
        owner ? `now held by ${factions[owner].name}` : "",
        tier ? `now a ${tierNames[tier]}` : "",
        troops !== undefined ? `${fmt(troops)} troops` : "",
      ].filter(Boolean);
      await updateTerritory(actor, t.id, { owner, tier, troops }, `${t.name}: ${parts.join(", ")}.`);
      return reply(`🏰 **${t.name}**: ${parts.join(", ")}. ${god.recorded}`, { private: troops !== undefined });
    }
    case "building":
    case "obstacle": {
      const t = read.place("name");
      const thing = read.text(sub.name, 40);
      if (!thing) return reply(god.which(sub.name), { private: true });
      const remove = read.choice("action", ["add", "remove"] as const) === "remove";
      const row = await getTerritoryRow(t.id);
      if (!row) return reply(god.notInWar, { private: true });
      const field = sub.name === "building" ? "buildings" : "obstacles";
      const list = remove ? row[field].filter((x) => x.toLowerCase() !== thing.toLowerCase()) : [...new Set([...row[field], thing])];
      const what = remove ? (sub.name === "building" ? "loses" : "is cleared of") : sub.name === "building" ? "builds" : "is struck by";
      await updateTerritory(actor, t.id, { [field]: list }, `${t.name} ${what} ${thing}.`);
      return reply(`${sub.name === "building" ? "🔨" : "✨"} **${t.name}** ${what} ${thing}. ${god.recorded}`, { private: true });
    }
    case "envoy":
    case "attack":
    case "ambush":
    case "raid": {
      const f = read.kingdom()!;
      const from = read.place("from");
      const to = read.place("to");
      if (from.id === to.id) return reply(god.samePlace, { private: true });
      const secret = read.bool("secret") ?? sub.name === "ambush";
      const { id, arrivesAt } = await startMovement(actor, {
        kind: sub.name,
        faction: f,
        from: from.id,
        to: to.id,
        hours: read.num("hours", 0, 240) ?? 2,
        troops: read.int("troops", 0, 10_000_000) ?? 0,
        cargo: read.text("cargo"),
        secret,
      });
      const icon = { envoy: "🐎", attack: "⚔️", ambush: "🏹", raid: "🔥" }[sub.name];
      const text = `${icon} **${factions[f].name}** ${sub.name}: ${from.name} → ${to.name}, arrives <t:${Math.floor(arrivesAt.getTime() / 1000)}:R>. Code \`${id}\`${secret ? " · secret: hidden from the map" : ""}`;
      return reply(text, { private: secret }); // a secret move is only shown to the staff member who recorded it
    }
    case "resolve": {
      const id = read.text("id", 5).toUpperCase();
      const outcome = read.choice("outcome", ["arrived", "won", "lost", "cancelled"] as const);
      if (!outcome) throw new InputError(god.pickOutcome);
      const movement = await resolveMovement(actor, id, outcome, read.text("note"));
      if (!movement) return reply(god.noMovement(id), { private: true });
      let extra = "";
      if (read.bool("capture") && outcome === "won" && movement.kind === "attack") {
        const target = findTerritory(movement.toId);
        const attacker = movement.faction as FactionId;
        if (target?.home) {
          await updateTerritory(actor, target.id, { owner: attacker }, `${factions[attacker].name} captures ${target.name}.`);
          extra = `\n🏴 **${factions[attacker].name} captures ${target.name}!**`;
        }
      }
      return reply(`Movement \`${movement.id}\`: **${outcome === "cancelled" ? "called off" : outcome}**.${extra}`, {
        private: movement.secret && outcome !== "won" && outcome !== "lost",
      });
    }
    case "reveal": {
      const movement = await revealMovement(actor, read.text("id", 5).toUpperCase());
      if (!movement) return reply(god.noMovement(read.text("id", 5).toUpperCase()), { private: true });
      return reply(`👁️ ${factions[movement.faction as FactionId]?.name}'s ${movement.kind} \`${movement.id}\` is discovered!`);
    }
    case "ruling": {
      const text = read.text("text", 500);
      if (!text) throw new InputError(god.badInput("text"));
      await recordRuling(actor, text);
      return reply(god.ruling(text, actor));
    }
    case "log": {
      const events = await recentEvents(read.int("count", 1, 25) ?? 15, true);
      const lines = events.map((e) => `<t:${Math.floor(e.at.getTime() / 1000)}:R> ${e.secret ? "🔒 " : ""}${e.summary} — <@${e.actor}>`);
      return reply(lines.join("\n") || god.nothingRecorded, { private: true });
    }
  }
  return reply(god.unknown, { private: true });
}
