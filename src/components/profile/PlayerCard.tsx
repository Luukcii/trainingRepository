// The player card: banner in the back, emblem on the left, name and callsign on top. Two sizes.
import { banners, type PlayerCardLook } from "@/content/player-card";
import { Emblem } from "./Emblem";

type PlayerCardProps = { name: string; callsign: string; look: PlayerCardLook; size?: "full" | "compact" };

export function PlayerCard({ name, callsign, look, size = "full" }: PlayerCardProps) {
  const full = size === "full";
  return (
    <div
      className={`relative flex items-center overflow-hidden rounded-lg text-white ${full ? "h-32 gap-4 px-4" : "h-14 gap-3 px-2"}`}
      style={{ background: banners[look.banner].background }}
    >
      {/* A dark fade behind the text, so it stays readable on light banners. */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
      <div className={`relative shrink-0 rounded-md border-2 border-white/70 bg-black/40 p-1 ${full ? "h-24 w-24" : "h-10 w-10"}`}>
        <Emblem emblem={look.emblem} color={look.color} className="h-full w-full" />
      </div>
      <div className="relative min-w-0 [text-shadow:0_1px_3px_rgb(0_0_0/0.8)]">
        <p className={`truncate font-bold uppercase tracking-wide ${full ? "text-2xl" : "text-sm"}`}>{name}</p>
        {callsign && <p className={`truncate tracking-widest uppercase opacity-90 ${full ? "text-sm" : "text-xs"}`}>{callsign}</p>}
      </div>
    </div>
  );
}
