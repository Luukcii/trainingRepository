// The list of posts. Text is shown as plain text: React escapes it, so a post can't run code (XSS).
import { listEntries } from "@/lib/guestbook";
import { timeAgo } from "@/lib/time";
import { deleteEntryAction } from "@/app/guestbook/actions";

export async function GuestbookEntries({ canDelete }: { canDelete: boolean }) {
  const entries = await listEntries();
  if (entries.length === 0) return <p className="text-muted">No messages yet. Be the first.</p>;

  return (
    <ul className="flex flex-col gap-4">
      {entries.map((e) => (
        <li key={e.id} className="rounded-lg border border-line p-4">
          <p className="whitespace-pre-wrap break-words">{e.body}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            <span>
              {e.name} · {timeAgo(e.createdAt)}
            </span>
            {canDelete && (
              <form action={deleteEntryAction}>
                <input type="hidden" name="id" value={e.id} />
                <button type="submit" className="hover:text-red-500">Delete</button>
              </form>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
