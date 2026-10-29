// "/members/<id>" — a member's player card, bio, and what you can do: add, message, block. Members only.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PlayerCard } from "@/components/profile/PlayerCard";
import { ActionButton } from "@/components/ui/ActionButton";
import { requireUser } from "@/lib/session";
import { getCard } from "@/lib/profiles";
import { relationTo } from "@/lib/friends";
import { iBlocked, isBlocked } from "@/lib/blocks";
import { acceptFriendAction, removeFriendAction, sendFriendRequestAction } from "@/app/friends/actions";
import { adminRemovePicturesAction, blockAction, unblockAction } from "./actions";

export const metadata: Metadata = { title: "Member", robots: { index: false } };

export default function MemberPage({ params }: PageProps<"/members/[userId]">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Link href="/friends" className="text-sm text-muted hover:text-foreground">← Friends</Link>
        <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
          <Member params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function Member({ params }: Pick<PageProps<"/members/[userId]">, "params">) {
  const me = await requireUser();
  const card = await getCard((await params).userId);
  if (!card) notFound();

  if (card.id !== me.id && (await isBlocked(me.id, card.id))) {
    // If they blocked you, the page acts like it doesn't exist (they stay hidden).
    if (!(await iBlocked(me.id, card.id))) notFound();
    return (
      <div className="mt-6 flex items-center justify-between rounded-lg border border-line p-4">
        <p>You blocked {card.name}.</p>
        <ActionButton action={unblockAction} field="userId" value={card.id} label="Unblock" />
      </div>
    );
  }

  const isMe = card.id === me.id;
  const { relation, friendshipId } = isMe ? { relation: "none", friendshipId: null } : await relationTo(me.id, card.id);

  return (
    <div className="mt-6 flex flex-col gap-6">
      <h1 className="sr-only">{card.name}</h1>
      <PlayerCard name={card.name} callsign={card.callsign} look={card.look} />
      {card.bio && <p className="whitespace-pre-wrap break-words">{card.bio}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {isMe ? (
          <Link href="/profile" className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
            Edit your card
          </Link>
        ) : (
          <>
            <Link href={`/messages/${card.id}`} className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Message
            </Link>
            {relation === "none" && <ActionButton action={sendFriendRequestAction} field="userId" value={card.id} label="Add friend" />}
            {relation === "sent" && <ActionButton action={removeFriendAction} field="id" value={friendshipId!} label="Cancel request" />}
            {relation === "received" && <ActionButton action={acceptFriendAction} field="id" value={friendshipId!} label="Accept request" />}
            {relation === "friends" && <span className="px-2 text-sm text-muted">Friends ✓</span>}
            <span className="flex-1" />
            <ActionButton action={blockAction} field="userId" value={card.id} label="Block" danger />
          </>
        )}
      </div>

      {me.role === "admin" && !isMe && (card.look.emblemImage || card.look.bannerImage) && (
        <div className="flex items-center justify-between rounded-lg border border-line p-4 text-sm">
          <span className="text-muted">Admin: this member uploaded their own pictures.</span>
          <ActionButton action={adminRemovePicturesAction} field="userId" value={card.id} label="Remove pictures" danger />
        </div>
      )}
    </div>
  );
}
