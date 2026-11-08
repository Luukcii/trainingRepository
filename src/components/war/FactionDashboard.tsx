// One kingdom's own page: its numbers, the land it holds, what it has on the move, and its news.
// Server-rendered from a WarState that was already filtered for this viewer (lib/war/state.ts).
import Link from "next/link";
import { factions, territories, type FactionId } from "@/content/war/map";
import { tierNames, type WarState } from "@/lib/war/types";
import { fmt, movementInfo, statInfo, statusLabel } from "./map/map-info";

const nameOf = (id: string) => territories.find((t) => t.id === id)?.name ?? id;

export function FactionDashboard({ faction, state }: { faction: FactionId; state: WarState }) {
  const stats = state.factions[faction];
  const held = territories.filter((t) => state.territories[t.id]?.owner === faction);
  const moving = state.movements.filter((m) => m.faction === faction || state.territories[m.to]?.owner === faction);
  const news = state.events.filter((e) => e.faction === faction);
  const color = factions[faction].color;

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        Day {state.day} of 30
        {state.source === "example" && " · example numbers until the war is set up"}
        {" · "}
        <Link href="/war/map" className="underline">Open the war map</Link>
      </p>

      {stats && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Treasury and scores</h2>
          <dl className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {statInfo.map((s) => {
              const value = s.key === "territories" ? held.length : stats[s.key];
              return (
                <div key={s.key} className="rounded-lg bg-line/40 px-3 py-2">
                  <dt className="text-xs text-muted">{s.label}</dt>
                  <dd className="font-semibold tabular-nums">{fmt(value)}</dd>
                  {s.goal && (
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-line" title={`Goal ${fmt(s.goal)}`}>
                      <div className="h-full" style={{ width: `${Math.min(100, (value / s.goal) * 100)}%`, background: color }} />
                    </div>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Land held ({held.length})</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {held.map((t) => {
            const ts = state.territories[t.id];
            return (
              <li key={t.id} className="rounded-lg border border-line px-3 py-2 text-sm">
                <p className="font-medium">
                  {t.number ?? "★"} · {t.name}
                  {t.home !== faction && <span className="text-muted"> (captured)</span>}
                </p>
                <p className="text-muted">
                  {tierNames[ts.tier]} · {ts.troops === null ? "troops secret" : `${fmt(ts.troops)} troops`}
                  {ts.buildings.length > 0 && ` · ${ts.buildings.join(", ")}`}
                  {ts.obstacles.length > 0 && ` · ⚠ ${ts.obstacles.join(", ")}`}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">On the move</h2>
          <ul className="space-y-1 text-sm">
            {moving.length === 0 && <li className="text-muted">Nothing on the move.</li>}
            {moving.map((m) => (
              <li key={m.id}>
                {movementInfo[m.kind].icon} <span style={{ color: factions[m.faction].color }}>{factions[m.faction].name}</span>{" "}
                {movementInfo[m.kind].label.toLowerCase()}: {nameOf(m.from)} → {nameOf(m.to)}{" "}
                <span className="text-muted">({statusLabel[m.status].toLowerCase()})</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold">News</h2>
          <ul className="space-y-1 text-sm">
            {news.length === 0 && <li className="text-muted">Nothing recorded yet.</li>}
            {news.map((e) => (
              <li key={e.id}>{e.summary}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
