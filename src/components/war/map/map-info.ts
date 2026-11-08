// Labels, icons and number helpers the map pieces share.
import type { FactionStats, MovementKind, MovementStatus } from "@/lib/war/types";

export const statInfo: { key: keyof FactionStats | "territories"; label: string; term: string; goal?: number }[] = [
  { key: "territories", label: "Territories", term: "territory" },
  { key: "gold", label: "Gold", term: "gold" },
  { key: "troops", label: "Troops", term: "troops" },
  { key: "stone", label: "Stone", term: "stone-lumber" },
  { key: "lumber", label: "Lumber", term: "stone-lumber" },
  { key: "faith", label: "Faith", term: "faith", goal: 25_000 },
  { key: "fame", label: "Fame", term: "fame", goal: 21_000 },
  { key: "trade", label: "Trade", term: "trade-win", goal: 425_000 },
  { key: "ap", label: "AP", term: "ap" },
];

export const movementInfo: Record<MovementKind, { label: string; icon: string; dash: string; width: number }> = {
  envoy: { label: "Envoy", icon: "🐎", dash: "30 18", width: 11 },
  attack: { label: "Attack", icon: "⚔️", dash: "", width: 14 },
  ambush: { label: "Ambush", icon: "🏹", dash: "6 18", width: 11 },
  raid: { label: "Raid", icon: "🔥", dash: "40 14 8 14", width: 12 },
};

export const statusLabel: Record<MovementStatus, string> = {
  moving: "On the way",
  arrived: "Arrived",
  won: "Won",
  lost: "Lost",
  cancelled: "Called off",
};

const numberFormat = new Intl.NumberFormat("en");
export const fmt = (n: number) => numberFormat.format(n);

export function timeUntil(target: number, now: number): string {
  const minutes = Math.round(Math.abs(target - now) / 60_000);
  const text = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return target >= now ? `in ${text}` : `${text} ago`;
}

// A gentle curve between two points, so lines that share a territory don't sit on top of each other.
export function curve(ax: number, ay: number, bx: number, by: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const cx = mx - dy * 0.18;
  const cy = my + dx * 0.18;
  const at = (t: number) => ({
    x: (1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t ** 2 * bx,
    y: (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t ** 2 * by,
  });
  return { d: `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`, at };
}
