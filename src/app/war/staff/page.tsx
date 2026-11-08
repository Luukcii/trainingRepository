// "/war/staff" — the war's staff: the admin, mods and techs, each linking to their own profile.
// Names and titles are public (players should know who their mods are); records are staff-only.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WarNav } from "@/components/war/WarNav";
import { listStaff } from "@/lib/war/staff";
import { RoleBadge } from "@/components/war/RoleBadge";

export const metadata: Metadata = { title: "Faction War — Staff", robots: { index: false } };

export default function StaffPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <WarNav current="staff" />
        <h1 className="font-stone text-3xl">Staff</h1>
        <p className="mt-1 mb-6 text-muted">The mods and techs who keep the war fair. God answers to them.</p>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <StaffList />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function StaffList() {
  await connection(); // read the database per visit, not once at build time
  const staff = await listStaff();
  if (staff.length === 0) return <p className="text-muted">No staff yet.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {staff.map((s) => (
        <li key={s.id}>
          <Link href={`/war/staff/${s.id}`} className="flex items-center justify-between rounded-lg border border-line p-4 hover:border-foreground">
            <span>
              <span className="font-medium">{s.name}</span>
              {s.username && <span className="block text-sm text-muted">@{s.username}</span>}
            </span>
            <RoleBadge role={s.role} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
