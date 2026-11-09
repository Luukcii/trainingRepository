// Small pills on staff cards. All the same gold (Max, 9 Nov): colours must never show who does what, and
// nothing marks who the admin is. RoleBadge: Max's badge, and Mod/Tech, which only staff may see.
// TitleBadge: a position (Owner, Head Human Resources…).
import { roleTitle } from "@/lib/war/roles";
import { findTitle } from "@/content/war/titles";

const pill = "rounded-full bg-[#d4a017] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-black";

export function RoleBadge({ role }: { role: string }) {
  return <span className={pill}>{roleTitle[role] ?? role}</span>;
}

export function TitleBadge({ title }: { title: string | null }) {
  const t = findTitle(title);
  if (!t) return null;
  return <span className={pill}>{t.label}</span>;
}

// Everything we show for one person. Who's a Mod or Tech (who runs God) is known only to staff: pass
// `secretsOk` only when the viewer is staff themselves.
export function StaffBadges({ role, warTitle, secretsOk }: { role: string; warTitle: string | null; secretsOk: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {role === "admin" && <RoleBadge role="admin" />}
      <TitleBadge title={warTitle} />
      {secretsOk && role !== "admin" && role !== "player" && <RoleBadge role={role} />}
    </span>
  );
}
