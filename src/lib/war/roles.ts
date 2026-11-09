// The Faction War moved to its own private site on 9 Nov (Luukcii/God, https://faction-war-ha.vercel.app),
// but it still shares this site's database and user table. Its accounts (made through God in Discord) carry
// these roles. This file stays here for one job: keeping them OUT of the invite-only members' site.
// If the war ever adds a role, add it here too, or that role would get into the members' site.
export const warAccountRoles = ["player", "mod", "tech"] as const;

// Accounts made through Discord. They log in to the war only; the members' site treats them as visitors.
export function isWarOnlyRole(role: string | null | undefined) {
  return (warAccountRoles as readonly string[]).includes(role ?? "");
}
