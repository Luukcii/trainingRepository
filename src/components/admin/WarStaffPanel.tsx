// Admin only: every Discord-made war account, with a role picker. Promote a player to Mod or Tech
// (mod mode: sees every faction) or back to Player. Reads the database, so it sits inside <Suspense>.
import Link from "next/link";
import { listWarAccounts } from "@/lib/war/staff";
import { roleTitle, warAccountRoles } from "@/lib/war/roles";
import { setWarRoleAction } from "@/app/admin/actions";
import { RoleBadge } from "@/components/war/RoleBadge";

export async function WarStaffPanel() {
  const accounts = await listWarAccounts();
  return (
    <section className="rounded-lg border border-line p-5 sm:col-span-2">
      <h2 className="mb-1 font-medium">Faction War staff</h2>
      <p className="mb-4 text-sm text-muted">
        Make a war account a Mod or Tech: they get mod mode (every faction visible) and a{" "}
        <Link href="/war/staff" className="underline">staff profile</Link>. They join through God first (<code>/war join</code>).
      </p>
      {accounts.length === 0 ? (
        <p className="text-sm text-muted">No war accounts yet.</p>
      ) : (
        <ul className="max-h-80 divide-y divide-line overflow-y-auto rounded-md border border-line">
          {accounts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
              <span className="min-w-0 flex-1 truncate">
                {a.name} <span className="text-muted">@{a.username}</span>
              </span>
              <RoleBadge role={a.role} />
              <form action={setWarRoleAction} className="flex gap-2">
                <input type="hidden" name="userId" value={a.id} />
                <select name="role" defaultValue={a.role} aria-label={`Role for ${a.username}`} className="rounded-md border border-line bg-background px-2 py-1">
                  {warAccountRoles.map((r) => (
                    <option key={r} value={r}>{roleTitle[r]}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-md bg-foreground px-3 py-1 font-medium text-background">Save</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
