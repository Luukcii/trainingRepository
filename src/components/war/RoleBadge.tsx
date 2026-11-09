// Small coloured pills. RoleBadge: what someone can do (Chaos Coordinator = Max, Mod, Tech). TitleBadge: their position (Owner, Head Human Resources…).
import { roleTitle } from "@/lib/war/roles";
import { findTitle } from "@/content/war/titles";

const pill = "rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide";

export function RoleBadge({ role }: { role: string }) {
  const color = role === "admin" ? "bg-[#d4a017] text-black" : role === "tech" ? "bg-sky-600 text-white" : role === "mod" ? "bg-amber-700 text-white" : "border border-line text-muted";
  return <span className={`${pill} ${color}`}>{roleTitle[role] ?? role}</span>;
}

export function TitleBadge({ title }: { title: string | null }) {
  const t = findTitle(title);
  if (!t) return null;
  return <span className={`${pill} ${t.public ? "bg-stone-200 text-stone-900" : "bg-purple-700 text-white"}`}>{t.label}</span>;
}

// Everything we show for one person. Mod/Tech pills are secret, so they only appear when `secretsOk`.
export function StaffBadges({ role, warTitle, secretsOk }: { role: string; warTitle: string | null; secretsOk: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {role === "admin" && <RoleBadge role="admin" />}
      <TitleBadge title={warTitle} />
      {secretsOk && role !== "admin" && role !== "player" && <RoleBadge role={role} />}
    </span>
  );
}
