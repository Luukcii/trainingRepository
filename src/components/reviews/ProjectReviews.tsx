// A project's approval score, the review form (members), and every review. Comments show as plain text.
import Link from "next/link";
import { listReviews } from "@/lib/reviews";
import { getUser } from "@/lib/session";
import { timeAgo } from "@/lib/time";
import { deleteReviewAction } from "@/app/projects/[slug]/actions";
import { ReviewForm } from "./ReviewForm";
import { approvalColor } from "./approval-color";

export async function ProjectReviews({ slug }: { slug: string }) {
  const [user, reviews] = await Promise.all([getUser(), listReviews(slug)]);
  const average = reviews.length ? Math.round(reviews.reduce((sum, r) => sum + r.approval, 0) / reviews.length) : null;
  const mine = user && reviews.find((r) => r.userId === user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        {average === null ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <>
            <p className="text-lg">
              <span className="text-3xl font-semibold" style={{ color: approvalColor(average) }}>{average}%</span> approval ·{" "}
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-line">
              <div className="h-2 rounded-full" style={{ width: `${average}%`, background: approvalColor(average) }} />
            </div>
          </>
        )}
      </div>

      {user ? (
        <ReviewForm slug={slug} initial={mine ? { approval: mine.approval, comment: mine.comment } : undefined} />
      ) : (
        <p className="text-muted">
          <Link href="/login" className="underline hover:text-foreground">Log in</Link> to leave a review. Accounts are invite-only.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-line p-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-medium">{r.name}</span>
              <span className="font-semibold tabular-nums" style={{ color: approvalColor(r.approval) }}>{r.approval}%</span>
            </div>
            {r.comment && <p className="mt-2 whitespace-pre-wrap break-words">{r.comment}</p>}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted">
              <span>{timeAgo(r.updatedAt)}</span>
              {user?.role === "admin" && (
                <form action={deleteReviewAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="hover:text-red-500">Delete</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
