"use client";
// What the pop-up shows when you tap a territory, a moving Envoy/Attack, or one of a kingdom's numbers.
import { factions, findTerritory, type FactionId } from "@/content/war/map";
import { findTerm } from "@/content/war/glossary";
import { tierNames, type Movement, type TerritoryState } from "@/lib/war/types";
import { RichText } from "../RichText";
import { Term } from "../Term";
import { fmt, movementInfo, statInfo, statusLabel, timeUntil } from "./map-info";
import { useNow } from "./use-now";

const tierTerm = { "town-hall": "town-hall", castle: "castle", fortress: "fortress" } as const;
const obstacleTerms: Record<string, string> = { Aegis: "aegis", "Hachiman's Toll": "hachiman-toll", "Loki's Shroud": "loki-shroud" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function FactionName({ id }: { id: FactionId | null }) {
  if (!id) return <Term id="neutral">Neutral</Term>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: factions[id].color }} />
      <Term id={id}>{factions[id].name}</Term>
    </span>
  );
}

export function TerritoryPopup({ id, state, movements }: { id: string; state: TerritoryState; movements: Movement[] }) {
  const t = findTerritory(id);
  if (!t) return null;
  const captured = t.home && state.owner !== t.home;
  const involved = movements.filter((m) => m.from === id || m.to === id);
  return (
    <div className="space-y-4">
      <p className="text-muted">
        {t.number ? `${t.home ? factions[t.home].name : ""} territory ${t.number}` : t.note}
        {captured && " · captured"}
      </p>
      <dl>
        <Row label="Held by"><FactionName id={state.owner} /></Row>
        {captured && <Row label="Originally"><FactionName id={t.home} /></Row>}
        {t.home && (
          <Row label="Tier">
            <Term id={tierTerm[state.tier]}>{tierNames[state.tier]}</Term>
          </Row>
        )}
        {t.home && state.troops === null && (
          <Row label="Troops and buildings"><span className="text-muted">Secret to its holder</span></Row>
        )}
        {t.home && state.troops !== null && <Row label="Troops"><Term id="troops">{fmt(state.troops)}</Term></Row>}
        {t.home && state.troops !== null && (
          <Row label="Buildings">{state.buildings.length ? state.buildings.join(", ") : <span className="text-muted">None yet</span>}</Row>
        )}
        {state.obstacles.length > 0 && (
          <Row label="Obstacles">
            {state.obstacles.map((o, i) => (
              <span key={o}>
                {i > 0 && ", "}
                {obstacleTerms[o] ? <Term id={obstacleTerms[o]}>{o}</Term> : <Term id="obstacle">{o}</Term>}
              </span>
            ))}
          </Row>
        )}
      </dl>
      {id === "xibalba" && (
        <p><RichText text="Home of [[vaelith|Vaelith]] and the [[black-market|Black Market]]." /></p>
      )}
      {involved.length > 0 && (
        <div>
          <p className="mb-1 font-medium">On the move here</p>
          <ul className="space-y-1 text-sm">
            {involved.map((m) => (
              <li key={m.id}>
                {movementInfo[m.kind].icon} {movementInfo[m.kind].label} · {factions[m.faction].name} · {findTerritory(m.from)?.name} → {findTerritory(m.to)?.name} ({statusLabel[m.status].toLowerCase()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function MovementPopup({ movement: m }: { movement: Movement }) {
  const now = useNow();
  const arrives = Date.parse(m.arrivesAt);
  const departs = Date.parse(m.departsAt);
  return (
    <div className="space-y-4">
      <p className="text-lg">
        {movementInfo[m.kind].icon} <Term id={m.kind}>{movementInfo[m.kind].label}</Term> by <FactionName id={m.faction} />
      </p>
      <dl>
        <Row label="From">{findTerritory(m.from)?.name ?? m.from}</Row>
        <Row label="To">{findTerritory(m.to)?.name ?? m.to}</Row>
        {m.troops > 0 && <Row label="Troops"><Term id="troops">{fmt(m.troops)}</Term></Row>}
        {m.cargo && <Row label={m.kind === "envoy" ? "Cargo" : "Note"}>{m.cargo}</Row>}
        <Row label="Status">{m.status === "moving" && now && now > arrives ? "Arrived, awaiting result" : statusLabel[m.status]}</Row>
        {now && <Row label="Set out">{timeUntil(departs, now)}</Row>}
        {now && <Row label={m.status === "moving" ? "Arrives" : "Arrived"}>{timeUntil(arrives, now)}</Row>}
        {now && m.status === "moving" && (
          <Row label="Journey">{Math.round(Math.min(1, Math.max(0, (now - departs) / (arrives - departs))) * 100)}% done</Row>
        )}
      </dl>
      <p className="text-sm text-muted">
        <RichText text={findTerm(m.kind)?.short ?? ""} />
      </p>
    </div>
  );
}

export function StatPopup({ faction, statKey, value }: { faction: FactionId; statKey: string; value: number }) {
  const info = statInfo.find((s) => s.key === statKey)!;
  const term = findTerm(info.term);
  const share = info.goal ? Math.min(1, value / info.goal) : null;
  return (
    <div className="space-y-4">
      <p className="text-3xl font-semibold tabular-nums">{fmt(value)}</p>
      {info.goal && share !== null && (
        <div>
          <div className="h-3 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full" style={{ width: `${share * 100}%`, background: factions[faction].color }} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {Math.round(share * 1000) / 10}% of the {fmt(info.goal)} the <Term id={info.term === "trade-win" ? "trade-win" : `${info.term}-win`}>{info.label} victory</Term> needs{info.key === "trade" ? "" : " with 20 active members (bigger kingdoms need more)"}. It&apos;s one part of that victory; tap the term for the rest.
          </p>
        </div>
      )}
      {term && (
        <p>
          <RichText text={term.short} />
        </p>
      )}
      <p className="text-sm">
        Learn more: <Term id={info.term}>{term?.term ?? info.label}</Term>
      </p>
    </div>
  );
}
