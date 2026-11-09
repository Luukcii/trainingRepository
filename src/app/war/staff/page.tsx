// "/war/staff" — who runs the war, in rank order: Owner, Head Human Resources, Max, Chief Server Technician,
// then the Gods (God and Odin), then everyone else. Everyone sees Max, the Gods and the public titles
// (Owner, Head Human Resources, Chief Server Technician). The rest of the staff (techs, faction leaders, seconds in command,
// territory owners…) appear only for logged-in players; logged-out visitors aren't told they exist.
// Decided here, on the server: the hidden names never reach a logged-out browser at all.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { WarHeader, WarFooter } from "@/components/war/WarHeader";
import { WarNav } from "@/components/war/WarNav";
import { StaffBadges } from "@/components/war/RoleBadge";
import { gods } from "@/content/war/titles";
import { getWarUser } from "@/lib/session";
import { isWarStaffRole } from "@/lib/war/roles";
import { isPublicStaff, isTopStaff, listStaff } from "@/lib/war/staff";

export const metadata: Metadata = { title: "Faction War — Staff", robots: { index: false } };

export default function StaffPage() {
  return (
    <>
      <WarHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <WarNav current="staff" />
        <h1 className="font-stone text-3xl">Staff</h1>
        <p className="mt-1 mb-6 text-muted">God and Odin maintain the realm.</p>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <StaffList />
        </Suspense>
      </main>
      <WarFooter />
    </>
  );
}

async function StaffList() {
  await connection(); // read the database per visit, not once at build time
  const [me, all] = await Promise.all([getWarUser(), listStaff()]);
  const people = me ? all : all.filter(isPublicStaff); // logged out: public positions only
  // Owner, Head Human Resources, Max and Chief Server Technician stand above the gods; everyone else below.
  const [top, rest] = [people.filter(isTopStaff), people.filter((p) => !isTopStaff(p))];
  const secretsOk = isWarStaffRole(me?.role); // Mod/Tech badges: staff only, so players can't tell who runs God

  return (
    <div className="space-y-6">
      <ul className="grid gap-3 sm:grid-cols-2">
        {top.map((p) => (
          <Person key={p.id} p={p} secretsOk={secretsOk} />
        ))}
        {gods.map((g) => (
          <li key={g.name} className="rounded-lg border border-[#d4a017]/60 p-4">
            <span className="flex items-center justify-between gap-2">
              <span className="font-stone text-xl">{g.name}</span>
              <span className="rounded-full bg-[#d4a017]/20 px-2.5 py-0.5 text-xs font-medium tracking-wide text-[#d4a017] uppercase">A God</span>
            </span>
            <span className="mt-1 block text-sm text-muted">{g.about}</span>
          </li>
        ))}
      </ul>
      {rest.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rest.map((p) => (
            <Person key={p.id} p={p} secretsOk={secretsOk} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Person({ p, secretsOk }: { p: Awaited<ReturnType<typeof listStaff>>[number]; secretsOk: boolean }) {
  return (
    <li>
      <Link href={`/war/staff/${p.id}`} className="flex h-full items-center justify-between gap-3 rounded-lg border border-line p-4 hover:border-foreground">
        <span className="min-w-0">
          <span className="font-medium">{p.name}</span>
          {p.username && <span className="block truncate text-sm text-muted">@{p.username}</span>}
        </span>
        <StaffBadges role={p.role} warTitle={p.warTitle} secretsOk={secretsOk} />
      </Link>
    </li>
  );
}
