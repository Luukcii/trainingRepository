// The admin's window onto the site: everything members do, newest first. Only the admin page renders this.
import { recentActivity } from "@/lib/activity";
import { timeAgo } from "@/lib/time";

export async function ActivityFeed() {
  const items = await recentActivity();

  return (
    <section className="rounded-lg border border-line p-5">
      <h2 className="mb-3 font-medium">Activity</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Nothing yet. When members sign in or post, it shows up here.</p>
      ) : (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1 text-sm">
          {items.map((a) => (
            <li key={a.id} className="border-b border-line pb-2 last:border-b-0">
              <span className="font-medium">{a.name}</span> <span className="text-muted">{a.summary}</span>
              <div className="text-xs text-muted">{timeAgo(a.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
