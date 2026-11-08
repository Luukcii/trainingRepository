// A small coloured pill with a staff title: Admin (gold), Mod (bronze), Tech (blue).
import { roleTitle } from "@/lib/war/roles";

export function RoleBadge({ role }: { role: string }) {
  const color = role === "admin" ? "bg-[#d4a017] text-black" : role === "tech" ? "bg-sky-600 text-white" : role === "mod" ? "bg-amber-700 text-white" : "border border-line text-muted";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${color}`}>{roleTitle[role] ?? role}</span>;
}
