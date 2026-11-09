// The slash commands God (the bot) offers, in the format Discord's API expects.
// scripts/register-discord-commands.ts sends this list to Discord; run it again after changing anything here.
// /war is for everyone (reading). /warstaff changes the record, so Discord only shows it to people with
// "Manage Server" — and the server checks again itself, because a server admin can change who sees a command.

const SUB = 1;
const STRING = 3;
const INTEGER = 4;
const BOOLEAN = 5;
const NUMBER = 10;

const MANAGE_GUILD = 1 << 5;

const kingdomChoices = [
  { name: "Svaroth", value: "svaroth" },
  { name: "Kōgahara", value: "kogahara" },
  { name: "Valdyruus", value: "valdyruus" },
];
const statChoices = ["gold", "troops", "stone", "lumber", "faith", "fame", "trade", "ap"].map((s) => ({ name: s, value: s }));

const kingdom = (required = true, description = "Which kingdom") => ({ type: STRING, name: "kingdom", description, required, choices: kingdomChoices });
const place = (name: string, description: string, required = true) => ({ type: STRING, name, description, required, autocomplete: true });
const movement = (kind: string) => ({
  type: SUB,
  name: kind,
  description: `Record a new ${kind}`,
  options: [
    kingdom(true, `Kingdom making the ${kind}`),
    place("from", "Where it sets out from"),
    place("to", kind === "ambush" ? "Where the ambush waits" : "Where it is going"),
    { type: NUMBER, name: "hours", description: "Hours until it arrives (default 2)", min_value: 0, max_value: 240 },
    { type: INTEGER, name: "troops", description: "Troops committed", min_value: 0, max_value: 10_000_000 },
    { type: STRING, name: "cargo", description: kind === "envoy" ? "What it carries" : "A short note", max_length: 100 },
    { type: BOOLEAN, name: "secret", description: kind === "ambush" ? "Hide from the map (default yes)" : "Hide from the map (e.g. smuggled)" },
  ],
});

export const commands = [
  {
    name: "war",
    description: "Ask God about the faction war",
    options: [
      { type: SUB, name: "join", description: "God makes your faction-war account and privately gives you a password" },
      { type: SUB, name: "password", description: "Lost your password? God gives you a new one (only you see it)" },
      { type: SUB, name: "status", description: "Your kingdom's treasury and scores (only you see the reply)", options: [kingdom(false, "Staff: leave empty for all three")] },
      { type: SUB, name: "territory", description: "Who holds a territory and what's on it", options: [place("name", "Territory name")] },
      { type: SUB, name: "moving", description: "Envoys, Attacks and raids on the move" },
      { type: SUB, name: "log", description: "The latest news", options: [{ type: INTEGER, name: "count", description: "How many (default 10)", min_value: 1, max_value: 25 }] },
      { type: SUB, name: "ask", description: "Ask God anything about the war's rules (only you see the answer)", options: [{ type: STRING, name: "question", description: "Your question", required: true, max_length: 300 }] },
      { type: SUB, name: "rule", description: "Explain a rule or term", options: [{ type: STRING, name: "term", description: "The word to explain", required: true, autocomplete: true }] },
      { type: SUB, name: "map", description: "Link to the war map and rulebooks" },
    ],
  },
  {
    name: "warstaff",
    description: "Record changes to the faction war (staff)",
    default_member_permissions: String(MANAGE_GUILD),
    dm_permission: false,
    options: [
      { type: SUB, name: "setup", description: "Start the war: every kingdom at 75,000 Gold, all territories at Town Hall (only once)" },
      {
        type: SUB,
        name: "mind",
        description: "Switch God's free answers (/war ask): off, Haiku (cheap) or Opus (wise). Empty = show today's use",
        options: [{ type: STRING, name: "mode", description: "How God answers", choices: [{ name: "Off", value: "off" }, { name: "Haiku (quick, cheap)", value: "haiku" }, { name: "Opus (wise, costs more)", value: "opus" }] }],
      },
      { type: SUB, name: "day", description: "Set the current war day", options: [{ type: INTEGER, name: "number", description: "War day", required: true, min_value: 1, max_value: 60 }] },
      {
        type: SUB,
        name: "adjust",
        description: "Add to (or take from) a kingdom's number",
        options: [
          kingdom(),
          { type: STRING, name: "stat", description: "Which number", required: true, choices: statChoices },
          { type: INTEGER, name: "amount", description: "How much (negative to take away)", required: true, min_value: -100_000_000, max_value: 100_000_000 },
          { type: STRING, name: "reason", description: "Why (shows in the log)", max_length: 100 },
        ],
      },
      {
        type: SUB,
        name: "set",
        description: "Set a kingdom's number exactly",
        options: [
          kingdom(),
          { type: STRING, name: "stat", description: "Which number", required: true, choices: statChoices },
          { type: INTEGER, name: "value", description: "New value", required: true, min_value: 0, max_value: 1_000_000_000 },
          { type: STRING, name: "reason", description: "Why (shows in the log)", max_length: 100 },
        ],
      },
      {
        type: SUB,
        name: "territory",
        description: "Change who holds a territory, its tier or its troops",
        options: [
          place("name", "Territory name"),
          kingdom(false, "New holder"),
          {
            type: STRING,
            name: "tier",
            description: "New tier",
            choices: [
              { name: "Town Hall", value: "town-hall" },
              { name: "Castle", value: "castle" },
              { name: "Fortress", value: "fortress" },
            ],
          },
          { type: INTEGER, name: "troops", description: "Troops stored there now", min_value: 0, max_value: 10_000_000 },
        ],
      },
      {
        type: SUB,
        name: "building",
        description: "Add or remove a building on a territory",
        options: [
          place("name", "Territory name"),
          { type: STRING, name: "building", description: "Building name, e.g. Barracks", required: true, max_length: 40 },
          { type: STRING, name: "action", description: "Add or remove (default add)", choices: [{ name: "add", value: "add" }, { name: "remove", value: "remove" }] },
        ],
      },
      {
        type: SUB,
        name: "obstacle",
        description: "Place or clear an obstacle on a territory",
        options: [
          place("name", "Territory name"),
          {
            type: STRING,
            name: "obstacle",
            description: "Which obstacle",
            required: true,
            choices: ["Void Spout", "Bestial Summon", "Plague", "Hachiman's Toll", "Loki's Shroud", "Aegis", "God's Wrath"].map((o) => ({ name: o, value: o })),
          },
          { type: STRING, name: "action", description: "Place or clear (default place)", choices: [{ name: "place", value: "add" }, { name: "clear", value: "remove" }] },
        ],
      },
      movement("envoy"),
      movement("attack"),
      movement("ambush"),
      movement("raid"),
      {
        type: SUB,
        name: "resolve",
        description: "Record how a movement ended",
        options: [
          { type: STRING, name: "id", description: "The movement's code, e.g. K7Q2M", required: true, min_length: 5, max_length: 5 },
          {
            type: STRING,
            name: "outcome",
            description: "What happened",
            required: true,
            choices: [
              { name: "arrived", value: "arrived" },
              { name: "won", value: "won" },
              { name: "lost", value: "lost" },
              { name: "called off", value: "cancelled" },
            ],
          },
          { type: BOOLEAN, name: "capture", description: "Attack won: hand the target territory to the attacker" },
          { type: STRING, name: "note", description: "Short note for the log", max_length: 100 },
        ],
      },
      {
        type: SUB,
        name: "reveal",
        description: "Put a secret movement on the public map",
        options: [{ type: STRING, name: "id", description: "The movement's code", required: true, min_length: 5, max_length: 5 }],
      },
      {
        type: SUB,
        name: "ruling",
        description: "Record a mods' ruling: God announces it and it goes in the war log",
        options: [{ type: STRING, name: "text", description: "The ruling, in plain words", required: true, max_length: 500 }],
      },
      { type: SUB, name: "log", description: "Latest news, secret entries included (only you see it)", options: [{ type: INTEGER, name: "count", description: "How many (default 15)", min_value: 1, max_value: 25 }] },
    ],
  },
];
