// Admin only: every Discord-made war account, with a role and a title. Role = what they can DO (Player, or
// Mod/Tech = mod mode: every faction visible). Title = what people SEE on /war/staff (Pope, HR, Faction Leader…).
// Reads the database, so it sits inside <Suspense>.
import Link from "next/link";
import { listWarAccounts } from "@/lib/war/staff";
import { roleTitle, warAccountRoles } from "@/lib/war/roles";
import { staffTitles } from "@/content/war/titles";
import { setWarRoleAction } from "@/app/admin/actions";
import { StaffBadges } from "@/components/war/RoleBadge";

const field = "rounded-md border border-line bg-background px-2 py-1";

export async function WarStaffPanel() {
  const accounts = await listWarAccounts();
  return (
    <section className="rounded-lg border border-line p-5 sm:col-span-2">
      <h2 className="mb-1 font-medium">Faction War staff</h2>
      <p className="mb-4 text-sm text-muted">
        <strong>Role</strong> is what they can do: Mod or Tech = mod mode (every faction visible, God&apos;s staff commands).{" "}
        <strong>Title</strong> is what people see on the <Link href="/war/staff" className="underline">staff page</Link>: Owner,
        HR, Chief Server Technician and Pope are shown to everyone; the others only to logged-in players. Accounts appear
        here once they&apos;ve joined through God (<code>/war join</code>).
      </p>
      {accounts.length === 0 ? (
        <p className="text-sm text-muted">No war accounts yet.</p>
      ) : (
        <ul className="max-h-96 divide-y divide-line overflow-y-auto rounded-md border border-line">
          {accounts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
              <span className="min-w-0 flex-1 truncate">
                {a.name} <span className="text-muted">@{a.username}</span>
              </span>
              <StaffBadges role={a.role} warTitle={a.warTitle} secretsOk />
              <form action={setWarRoleAction} className="flex flex-wrap gap-2">
                <input type="hidden" name="userId" value={a.id} />
                <select name="role" defaultValue={a.role} aria-label={`Role for ${a.username}`} className={field}>
                  {warAccountRoles.map((r) => (
                    <option key={r} value={r}>{roleTitle[r]}</option>
                  ))}
                </select>
                <select name="title" defaultValue={a.warTitle ?? ""} aria-label={`Title for ${a.username}`} className={field}>
                  <option value="">No title</option>
                  {staffTitles.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}{t.public ? "" : " (secret)"}</option>
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
