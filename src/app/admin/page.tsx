// "/admin" — the dashboard. The session check happens here, on the server, every request.
import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { Panel } from "@/components/admin/Panel";
import { InvitePanel } from "@/components/admin/InvitePanel";
import { ActivityFeed } from "@/components/admin/ActivityFeed";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-muted">Checking session…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireAdmin(); // not logged in → /login; logged in but not admin → /

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Welcome, {user.name}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Site content">Edit the hero, about, and contact text.</Panel>
        <Panel title="Projects">Add, edit, and reorder work items.</Panel>
        <ActivityFeed />
        <InvitePanel />
      </div>
    </>
  );
}
