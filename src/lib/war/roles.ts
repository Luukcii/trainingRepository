// Who's who in the faction war. Roles live in the user table; only the admin (Max) can change them, on /admin.
//   player — a war account made through God (Discord); sees their own kingdom only.
//   mod    — war staff: sees every faction ("mod mode"), has a staff profile.
//   tech   — war staff on the technical side: same view as a mod, different title.
//   admin  — Max: everything, plus the members' site and /admin.
export const warStaffRoles = ["mod", "tech"] as const;
export const warAccountRoles = ["player", ...warStaffRoles] as const; // roles a Discord-made account can hold
export type WarAccountRole = (typeof warAccountRoles)[number];

export const roleTitle: Record<string, string> = { admin: "Admin", mod: "Mod", tech: "Tech", player: "Player" };

// Sees every faction on the site, and counts as staff for God's /warstaff commands (lib/discord/handle.ts).
export function isWarStaffRole(role: string | null | undefined) {
  return role === "admin" || (warStaffRoles as readonly string[]).includes(role ?? "");
}

// Accounts made through Discord. They log in to the war only; the invite-only members' site stays shut to them.
export function isWarOnlyRole(role: string | null | undefined) {
  return (warAccountRoles as readonly string[]).includes(role ?? "");
}
