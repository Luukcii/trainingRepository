// "/war/staff/<id>" — one staff member's profile. Public titles (and Max) are open to anyone; secret staff only to
// logged-in players. Only staff see the record (everything they've written into the war through God, secrets included).
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WarHeader, WarFooter } from "@/components/war/WarHeader";
import { WarNav } from "@/components/war/WarNav";
import { factionIds, factions, type FactionId } from "@/content/war/map";
import { getWarUser } from "@/lib/session";
import { getStaffMember, isPublicStaff, staffRecord } from "@/lib/war/staff";
import { isWarStaffRole } from "@/lib/war/roles";
import { StaffBadges } from "@/components/war/RoleBadge";
import { WarLoginRequired } from "@/components/war/account/WarLoginRequired";

export const metadata: Metadata = { title: "Faction War — Staff profile", robots: { index: false } };

export default function StaffProfilePage({ params }: PageProps<"/war/staff/[id]">) {
  return (
    <>
      <WarHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <WarNav current="staff" />
        <Link href="/war/staff" className="text-sm text-muted hover:text-foreground">← All staff</Link>
        <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
          <Profile params={params} />
        </Suspense>
      </main>
      <WarFooter />
    </>
  );
}

async function Profile({ params }: Pick<PageProps<"/war/staff/[id]">, "params">) {
  const { id } = await params;
  const [me, person] = await Promise.all([getWarUser(), getStaffMember(id.slice(0, 100))]);
  // Logged out: only Max and public titles. A secret or unknown id gets the same login box, so the page
  // never gives away that a hidden staff member exists.
  if (!me && (!person || !isPublicStaff(person))) {
    return <div className="mt-6"><WarLoginRequired what="this profile" next="/war/staff" /></div>;
  }
  if (!person) notFound();
  const isMe = me?.id === person.id;
  const canSeeRecord = isWarStaffRole(me?.role);
  const sworn = factionIds.includes(person.warFaction as FactionId) ? factions[person.warFaction as FactionId] : null;

  return (
    <div className="mt-6 space-y-6">
      <header className="rounded-xl border border-line p-5" style={{ borderTop: "6px solid #d4a017" }}>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-stone text-3xl">{person.name}</h1>
          <StaffBadges role={person.role} warTitle={person.warTitle} secretsOk={canSeeRecord} />
          {isMe && <span className="text-sm text-muted">(you)</span>}
        </div>
        <p className="mt-1 text-muted">
          {person.username && <>@{person.username} · </>}
          On staff since {person.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          {/* Only staff see a staff member's own kingdom: it's useful for spotting conflicts of interest. */}
          {canSeeRecord && sworn && (
            <>
              {" · plays for the "}
              <span style={{ color: sworn.color }}>{sworn.people}</span>
            </>
          )}
        </p>
      </header>

      {canSeeRecord ? (
        <Record discordId={person.discordId} />
      ) : (
        <p className="text-muted">Their record of rulings and changes is visible to staff.</p>
      )}
    </div>
  );
}

async function Record({ discordId }: { discordId: string | null }) {
  const events = await staffRecord(discordId);
  return (
    <section>
      <h2 className="mb-3 text-lg font-medium">Record</h2>
      {!discordId ? (
        <p className="text-sm text-muted">No Discord account linked, so nothing recorded through God yet.</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted">Nothing recorded yet.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line">
          {events.map((e) => {
            const f = factionIds.includes(e.faction as FactionId) ? factions[e.faction as FactionId] : null;
            return (
              <li key={e.id} className="flex flex-wrap gap-x-3 gap-y-1 p-3 text-sm">
                <time className="text-muted" dateTime={e.at.toISOString()}>
                  {e.at.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </time>
                {f && <span style={{ color: f.color }}>{f.people}</span>}
                {e.secret && <span className="rounded bg-red-600/20 px-1.5 text-xs text-red-500">secret</span>}
                <span className="basis-full">{e.summary}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
