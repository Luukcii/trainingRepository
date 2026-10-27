// "/admin" — the dashboard. The session check happens here, on the server, every request.
import { Suspense } from "react";
import { requireSession } from "@/lib/session";
import { Panel } from "@/components/admin/Panel";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-muted">Checking session…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireSession(); // not logged in → redirected to /login

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Welcome, {user.name}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Site content">Edit the hero, about, and contact text.</Panel>
        <Panel title="Projects">Add, edit, and reorder work items.</Panel>
        <Panel title="Messages">Contact form submissions will appear here.</Panel>
        <Panel title="Settings">Account and site settings.</Panel>
      </div>
    </>
  );
}
