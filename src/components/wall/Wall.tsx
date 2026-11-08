// A member's wall: the post box (for them and their friends), then posts with their comments.
import Link from "next/link";
import { Emblem } from "@/components/profile/Emblem";
import { ActionButton } from "@/components/ui/ActionButton";
import { deleteWallCommentAction, deleteWallPostAction } from "@/app/members/[userId]/wall-actions";
import { canWrite, listWall } from "@/lib/wall";
import { timeAgo } from "@/lib/time";
import type { PlayerCardLook } from "@/content/player-card";
import { WallForm } from "./WallForm";

type WallProps = { me: { id: string; role: string }; owner: { id: string; name: string } };

export async function Wall({ me, owner }: WallProps) {
  const [posts, writable] = await Promise.all([listWall(owner.id), canWrite(me.id, owner.id)]);
  const isMyWall = me.id === owner.id;
  const canDelete = (authorId: string) => authorId === me.id || isMyWall || me.role === "admin";

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium">Wall</h2>
      {writable ? (
        <WallForm kind="post" wallOwnerId={owner.id} placeholder={isMyWall ? "Post something on your wall…" : `Write on ${owner.name}'s wall…`} />
      ) : (
        <p className="text-sm text-muted">Only {owner.name}&apos;s friends can post here.</p>
      )}

      {posts.length === 0 && <p className="text-sm text-muted">Nothing here yet.</p>}
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id} className="rounded-lg border border-line p-4">
            <Byline authorId={post.authorId} name={post.name} look={post.look} when={post.createdAt}>
              {canDelete(post.authorId) && <ActionButton action={deleteWallPostAction} field="id" value={post.id} label="Delete" />}
            </Byline>
            <p className="mt-2 whitespace-pre-wrap break-words">{post.body}</p>

            {(post.comments.length > 0 || writable) && (
              <div className="mt-3 flex flex-col gap-3 border-l-2 border-line pl-4">
                {post.comments.map((c) => (
                  <div key={c.id}>
                    <Byline authorId={c.authorId} name={c.name} look={c.look} when={c.createdAt} small>
                      {canDelete(c.authorId) && <ActionButton action={deleteWallCommentAction} field="id" value={c.id} label="Delete" />}
                    </Byline>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm">{c.body}</p>
                  </div>
                ))}
                {writable && <WallForm kind="comment" postId={post.id} placeholder="Write a reply…" />}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Who wrote it (emblem + name → their profile), when, and an optional delete button.
function Byline(props: { authorId: string; name: string; look: PlayerCardLook; when: Date; small?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/members/${props.authorId}`} className="flex min-w-0 items-center gap-2 hover:underline">
        <Emblem emblem={props.look.emblem} color={props.look.color} image={props.look.emblemImage} className={props.small ? "h-5 w-5" : "h-7 w-7"} />
        <span className={`truncate font-medium ${props.small ? "text-sm" : ""}`}>{props.name}</span>
      </Link>
      <span className="text-xs text-muted">{timeAgo(props.when)}</span>
      <span className="flex-1" />
      {props.children}
    </div>
  );
}
