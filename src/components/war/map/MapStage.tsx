"use client";
// The map picture you can drag and zoom (mouse wheel, pinch, or the + / − buttons), with a tappable
// marker on every territory and a line for every Envoy, Attack, ambush and raid.
// Dragging moves the map by changing one CSS transform directly, without re-drawing React on every frame.
import { useCallback, useEffect, useRef } from "react";
import { factions, MAP_SIZE, territories, findTerritory } from "@/content/war/map";
import type { Movement, WarState } from "@/lib/war/types";
import { curve, movementInfo } from "./map-info";
import { useNow } from "./use-now";

type Props = {
  state: WarState;
  onTerritory: (id: string) => void;
  onMovement: (movement: Movement) => void;
};

const MAX_ZOOM = 3;
const RING_PX = 44; // a territory ring's tap area on screen when zoomed out
const RING_IMAGE_PX = 64; // the number badges painted on the map are about this wide

export function MapStage({ state, onTerritory, onMovement }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0, min: 0.1 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; cx: number; cy: number } | null>(null);
  const dragged = useRef(0); // how far the current press has moved; a long move isn't a tap
  const now = useNow();

  const apply = useCallback(() => {
    const el = layer.current;
    if (!el) return;
    const { s, x, y } = view.current;
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    el.style.setProperty("--inv", String(1 / s)); // movement icons: the same size on screen at every zoom
    // Territory rings: at least finger-sized, and once zoomed in they grow with the map to frame its number badge.
    el.style.setProperty("--ring", String(Math.max(1 / s, RING_IMAGE_PX / RING_PX)));
  }, []);

  const clamp = useCallback(() => {
    const box = stage.current;
    if (!box) return;
    const v = view.current;
    const W = box.clientWidth;
    const H = box.clientHeight;
    const w = MAP_SIZE.width * v.s;
    const h = MAP_SIZE.height * v.s;
    v.x = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, v.x));
    v.y = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, v.y));
  }, []);

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      const v = view.current;
      const next = Math.max(v.min, Math.min(MAX_ZOOM, v.s * factor));
      v.x = cx - ((cx - v.x) * next) / v.s;
      v.y = cy - ((cy - v.y) * next) / v.s;
      v.s = next;
      clamp();
      apply();
    },
    [apply, clamp],
  );

  const fit = useCallback(() => {
    const box = stage.current;
    if (!box) return;
    const fitWhole = Math.min(box.clientWidth / MAP_SIZE.width, box.clientHeight / MAP_SIZE.height);
    const fill = Math.max(box.clientWidth / MAP_SIZE.width, box.clientHeight / MAP_SIZE.height);
    view.current.min = fitWhole;
    // If the whole map nearly fits (wide screens), show all of it; otherwise (phones) fill the box and let the player drag.
    view.current.s = fill / fitWhole < 1.15 ? fitWhole : fill;
    view.current.x = (box.clientWidth - MAP_SIZE.width * view.current.s) / 2;
    view.current.y = (box.clientHeight - MAP_SIZE.height * view.current.s) / 2;
    clamp();
    apply();
  }, [apply, clamp]);

  useEffect(() => {
    fit();
    const box = stage.current;
    if (!box) return;
    const observer = new ResizeObserver(() => fit());
    observer.observe(box);
    // Wheel zoom needs a non-passive listener so the page doesn't scroll at the same time.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = box.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      observer.disconnect();
      box.removeEventListener("wheel", onWheel);
    };
  }, [fit, zoomAt]);

  const local = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, local(e));
    pinch.current = null;
    if (pointers.current.size === 1) dragged.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const before = pointers.current.get(e.pointerId);
    if (!before) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 1) {
      dragged.current += Math.abs(p.x - before.x) + Math.abs(p.y - before.y);
      if (dragged.current > 6) {
        // Only now take over the pointer: before this, a press is still a tap on a marker.
        if (!stage.current!.hasPointerCapture(e.pointerId)) stage.current!.setPointerCapture(e.pointerId);
        view.current.x += p.x - before.x;
        view.current.y += p.y - before.y;
        clamp();
        apply();
      }
    } else if (pointers.current.size === 2) {
      dragged.current = 100;
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      if (pinch.current) {
        view.current.x += cx - pinch.current.cx;
        view.current.y += cy - pinch.current.cy;
        zoomAt(d / pinch.current.d, cx, cy);
      }
      pinch.current = { d, cx, cy };
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
  };

  // A click that ends a drag shouldn't also open a pop-up.
  const tapOnly = (action: () => void) => () => {
    if (dragged.current <= 6) action();
  };

  const center = () => {
    const box = stage.current!;
    return [box.clientWidth / 2, box.clientHeight / 2] as const;
  };

  const pct = (x: number, y: number) => ({ left: `${(x / MAP_SIZE.width) * 100}%`, top: `${(y / MAP_SIZE.height) * 100}%` });

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-[#0e1116]">
      <div
        ref={stage}
        className="relative h-[65vh] max-h-[52rem] min-h-80 cursor-grab touch-none select-none active:cursor-grabbing sm:h-[70vh]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          ref={layer}
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: MAP_SIZE.width, height: MAP_SIZE.height }}
        >
          {/* A plain <img>: the map must stay full size so zooming in stays sharp. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/war/map.webp" width={MAP_SIZE.width} height={MAP_SIZE.height} alt="The HAFW war map" draggable={false} className="pointer-events-none block" />

          <svg viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {state.movements.map((m) => {
              const a = findTerritory(m.from);
              const b = findTerritory(m.to);
              if (!a || !b) return null;
              const info = movementInfo[m.kind];
              return (
                <path
                  key={m.id}
                  d={curve(a.x, a.y, b.x, b.y).d}
                  fill="none"
                  stroke={factions[m.faction].color}
                  strokeWidth={info.width}
                  strokeDasharray={info.dash || undefined}
                  strokeLinecap="round"
                  opacity={m.status === "moving" ? 0.95 : 0.4}
                  style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,.9))" }}
                />
              );
            })}
          </svg>

          {territories.map((t) => {
            const owner = state.territories[t.id]?.owner ?? t.home;
            const captured = t.home !== null && owner !== t.home;
            const color = owner ? factions[owner].color : "#d9b400";
            return (
              <button
                key={t.id}
                type="button"
                onClick={tapOnly(() => onTerritory(t.id))}
                aria-label={`${t.name}${owner ? `, held by ${factions[owner].name}` : ", neutral"}`}
                className="absolute flex h-11 w-11 items-center justify-center rounded-full"
                style={{ ...pct(t.x, t.y), transform: "translate(-50%, -50%) scale(var(--ring, 1))" }}
              >
                <span
                  className="block h-7 w-7 rounded-full"
                  style={{
                    border: `3px solid ${color}`,
                    boxShadow: captured ? `0 0 0 3px #fff, 0 0 12px 4px ${color}` : "0 0 0 1px rgba(0,0,0,.6)",
                    background: captured ? `${color}55` : "transparent",
                  }}
                />
                {captured && (
                  <span className="absolute -right-1 -top-1 rounded bg-white px-1 text-[10px] font-bold leading-4 text-black">⚑</span>
                )}
              </button>
            );
          })}

          {now !== null &&
            state.movements.map((m) => {
              const a = findTerritory(m.from);
              const b = findTerritory(m.to);
              if (!a || !b) return null;
              const departs = Date.parse(m.departsAt);
              const arrives = Date.parse(m.arrivesAt);
              const progress = m.status === "moving" ? Math.min(1, Math.max(0, (now - departs) / Math.max(1, arrives - departs))) : 1;
              const p = curve(a.x, a.y, b.x, b.y).at(m.status === "moving" ? progress : 0.5);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={tapOnly(() => onMovement(m))}
                  aria-label={`${movementInfo[m.kind].label} by ${factions[m.faction].name} from ${a.name} to ${b.name}`}
                  className="absolute flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg shadow-lg"
                  style={{
                    ...pct(p.x, p.y),
                    transform: "translate(-50%, -50%) scale(var(--inv, 1))",
                    background: "#11151c",
                    borderColor: factions[m.faction].color,
                    opacity: m.status === "moving" ? 1 : 0.65,
                  }}
                >
                  {movementInfo[m.kind].icon}
                </button>
              );
            })}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <ControlButton label="Zoom in" onClick={() => zoomAt(1.5, ...center())}>+</ControlButton>
        <ControlButton label="Zoom out" onClick={() => zoomAt(1 / 1.5, ...center())}>−</ControlButton>
        <ControlButton label="Reset view" onClick={fit}>⤢</ControlButton>
      </div>
    </div>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="h-11 w-11 rounded-full border border-white/20 bg-black/70 text-xl text-white backdrop-blur hover:bg-black/90"
    >
      {children}
    </button>
  );
}
