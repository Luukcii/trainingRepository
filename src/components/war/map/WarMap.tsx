"use client";
// The whole war map page: each kingdom's numbers, the map, a legend and the latest news.
// It asks the server for fresh numbers every 30 seconds while the tab is open.
import { useEffect, useState } from "react";
import Link from "next/link";
import { factionIds, factions, territories, resourceTotals, type FactionId } from "@/content/war/map";
import type { Movement, WarState } from "@/lib/war/types";
import { ExplainProvider, useExplain } from "../ExplainProvider";
import { RichText } from "../RichText";
import { Term } from "../Term";
import { MapStage } from "./MapStage";
import { MovementPopup, StatPopup, TerritoryPopup } from "./MapPopups";
import { fmt, movementInfo, statInfo, timeUntil } from "./map-info";
import { useNow } from "./use-now";

const REFRESH_MS = 30_000;

export function WarMap({ initial }: { initial: WarState }) {
  return (
    <ExplainProvider>
      <WarMapInner initial={initial} />
    </ExplainProvider>
  );
}

function WarMapInner({ initial }: { initial: WarState }) {
  const [state, setState] = useState(initial);
  const { openCustom, openTerm } = useExplain();
  const now = useNow();

  useEffect(() => {
    const timer = setInterval(async () => {
      if (document.hidden) return; // no point updating a tab nobody is looking at
      try {
        const res = await fetch("/api/war/state", { cache: "no-store" });
        if (res.ok) setState(await res.json());
      } catch {
        // offline for a moment; try again next round
      }
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const held = (f: FactionId) => Object.values(state.territories).filter((t) => t.owner === f).length;

  const showTerritory = (id: string) =>
    openCustom(territories.find((t) => t.id === id)?.name ?? id, (
      <TerritoryPopup id={id} state={state.territories[id]} movements={state.movements} />
    ));
  const showMovement = (m: Movement) => openCustom(`${movementInfo[m.kind].label} ${m.id}`, <MovementPopup movement={m} />);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">War map</h1>
        <span className="rounded-full border border-line px-3 py-1 text-sm">
          <Term id="war-day">Day {state.day}</Term> of 30
        </span>
        {state.source === "example" ? (
          <button
            type="button"
            onClick={() =>
              openCustom(
                "Example data",
                <p>
                  These numbers are made up to show how the map works. Once the Discord bot records the real war, this
                  badge disappears and the map shows the live record, updating every 30 seconds.
                </p>,
              )
            }
            className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300"
          >
            Example data ⓘ
          </button>
        ) : (
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            ● Live
          </span>
        )}
      </div>

      <p className="rounded-lg border border-line px-4 py-3 text-sm">
        {state.viewer === "all"
          ? "Staff view: every kingdom's numbers."
          : state.viewer
            ? `You see ${factions[state.viewer].name}'s numbers, land, Envoys and news. Other kingdoms' stay secret; buy what you need from Vaelith.`
            : "Public view: who holds each territory and its tier. "}
        {!state.viewer && (
          <Link href="/war" className="underline">
            Log in and choose your faction to see your kingdom&apos;s numbers.
          </Link>
        )}
      </p>

      {/* Phones: swipe sideways between kingdoms. Wider screens: all three side by side. */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {factionIds.map((f) => (
          <section
            key={f}
            className="w-[85%] shrink-0 snap-center rounded-xl border border-line p-4 md:w-auto"
            style={{ borderTop: `4px solid ${factions[f].color}` }}
          >
            <h2 className="text-lg font-semibold">
              <Term id={f}>{factions[f].name}</Term> <span className="text-sm font-normal text-muted">{factions[f].people}</span>
            </h2>
            {!state.factions[f] ? (
              <dl className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-line/40 px-2 py-2">
                  <dt className="text-xs text-muted">Territories</dt>
                  <dd className="font-semibold tabular-nums">{fmt(held(f))}</dd>
                </div>
                <div className="col-span-2 rounded-lg bg-line/40 px-2 py-2 text-sm text-muted">
                  Secret. <Term id="quarter">Public totals</Term> are posted after days 7, 14 and 21.
                </div>
              </dl>
            ) : (
            <dl className="mt-3 grid grid-cols-3 gap-2">
              {statInfo.map((s) => {
                const stats = state.factions[f]!;
                const value = s.key === "territories" ? held(f) : stats[s.key];
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => openCustom(`${s.label} — ${factions[f].name}`, <StatPopup faction={f} statKey={s.key} value={value} />)}
                    className="rounded-lg bg-line/40 px-2 py-2 text-left hover:bg-line"
                  >
                    <dt className="text-xs text-muted">{s.label}</dt>
                    <dd className="font-semibold tabular-nums">{fmt(value)}</dd>
                    {s.goal && (
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                        <div className="h-full" style={{ width: `${Math.min(100, (value / s.goal) * 100)}%`, background: factions[f].color }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </dl>
            )}
          </section>
        ))}
      </div>

      <MapStage state={state} onTerritory={showTerritory} onMovement={showMovement} />

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="py-1 text-muted">Tap to learn:</span>
        {(Object.keys(movementInfo) as (keyof typeof movementInfo)[]).map((k) => (
          <button key={k} type="button" onClick={() => openTerm(k)} className="rounded-full border border-line px-3 py-1 hover:bg-line">
            {movementInfo[k].icon} {movementInfo[k].label}
          </button>
        ))}
        <button type="button" onClick={() => openTerm("territory")} className="rounded-full border border-line px-3 py-1 hover:bg-line">
          ◯ Territory
        </button>
        <button
          type="button"
          onClick={() =>
            openCustom("Captured territory", <p>A white ring and ⚑ mean the territory has changed hands: its ring shows the kingdom that holds it now.</p>)
          }
          className="rounded-full border border-line px-3 py-1 hover:bg-line"
        >
          ⚑ Captured
        </button>
        {(
          [
            ["Gold", "goldmine", resourceTotals.gold],
            ["Building", "stone-lumber", resourceTotals.building],
            ["Economic", "economic-goods", resourceTotals.economic],
            ["Luxury", "luxury-goods", resourceTotals.luxury],
          ] as const
        ).map(([label, term, list]) => (
          <button
            key={label}
            type="button"
            onClick={() =>
              openCustom(`${label} resources`, (
                <div className="space-y-3">
                  <p><RichText text={`[[${term}]]`} /> — tap for the rule.</p>
                  <ul className="grid grid-cols-2 gap-1 text-sm">
                    {list.map((r) => (
                      <li key={r.name}>{r.name} × {r.count}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted">Sites on the whole map. Each marker on the map is one site.</p>
                </div>
              ))
            }
            className="rounded-full border border-line px-3 py-1 hover:bg-line"
          >
            {label} sites
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Latest news</h2>
          <ul className="space-y-2">
            {state.events.length === 0 && <li className="text-muted">{state.viewer ? "Nothing recorded yet." : "Members see their kingdom's news here."}</li>}
            {state.events.map((e) => (
              <li key={e.id} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: e.faction ? factions[e.faction].color : "#999" }} />
                <span>
                  {e.summary} {now && <span className="text-muted">· {timeUntil(Date.parse(e.at), now)}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">On the move</h2>
          <ul className="space-y-1">
            {state.movements.length === 0 && <li className="text-sm text-muted">{state.viewer ? "Nothing on the move." : "Members see their kingdom's Envoys and Attacks here."}</li>}
            {state.movements.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => showMovement(m)} className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-line">
                  {movementInfo[m.kind].icon} <span style={{ color: factions[m.faction].color }}>{factions[m.faction].name}</span>{" "}
                  {movementInfo[m.kind].label.toLowerCase()}: {territories.find((t) => t.id === m.from)?.name} →{" "}
                  {territories.find((t) => t.id === m.to)?.name}
                  {now && <span className="text-muted"> · {m.status !== "moving" ? m.status : Date.parse(m.arrivesAt) < now ? "awaiting result" : `arrives ${timeUntil(Date.parse(m.arrivesAt), now)}`}</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <details className="rounded-xl border border-line">
        <summary className="cursor-pointer px-4 py-3 font-medium">All territories (list)</summary>
        <div className="grid gap-4 px-4 pb-4 sm:grid-cols-3">
          {[...factionIds, null].map((home) => (
            <div key={home ?? "neutral"}>
              <h3 className="mb-1 font-semibold">{home ? factions[home].name : "Neutral"}</h3>
              <ul className="text-sm">
                {territories
                  .filter((t) => t.home === home)
                  .map((t) => {
                    const owner = state.territories[t.id]?.owner;
                    return (
                      <li key={t.id}>
                        <button type="button" onClick={() => showTerritory(t.id)} className="w-full rounded px-1 py-1 text-left hover:bg-line">
                          {t.number ?? "★"} · {t.name}
                          {home && owner !== home && owner && <span style={{ color: factions[owner].color }}> (held by {factions[owner].name})</span>}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
