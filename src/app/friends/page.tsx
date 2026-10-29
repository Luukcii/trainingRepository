// "/friends" — requests, your friends, and everyone else (minus blocks). Members only.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PlayerCard } from "@/components/profile/PlayerCard";
import { ActionButton } from "@/components/ui/ActionButton";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { getUser } from "@/lib/session";
import { membersWithRelation } from "@/lib/friends";
import { looksFor, type Card } from "@/lib/profiles";
import { acceptFriendAction, removeFriendAction, sendFriendRequestAction } from "./actions";

export const metadata: Metadata = { title: "Friends", robots: { index: false } };

export default function FriendsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Friends</h1>
          <Link href="/profile" className="text-sm text-muted hover:text-foreground">Edit your card →</Link>
        </div>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <FriendsLists />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function FriendsLists() {
  const me = await getUser();
  if (!me) return <SignInPrompt />;
  const people = await membersWithRelation(me.id);
  const looks = await looksFor(people.map((p) => p.id));
  const cardOf = (p: { id: string; name: string }) => ({ ...p, ...looks.get(p.id)! });
  const requests = people.filter((p) => p.relation === "received");
  const friends = people.filter((p) => p.relation === "friends");
  const others = people.filter((p) => p.relation === "none" || p.relation === "sent");

  return (
    <div className="flex flex-col gap-10">
      {requests.length > 0 && (
        <Group title="Friend requests">
          {requests.map((p) => (
            <Row key={p.id} card={cardOf(p)}>
              <ActionButton action={acceptFriendAction} field="id" value={p.friendshipId!} label="Accept" primary />
              <ActionButton action={removeFriendAction} field="id" value={p.friendshipId!} label="Decline" />
            </Row>
          ))}
        </Group>
      )}

      <Group title="Your friends">
        {friends.length === 0 && <p className="text-sm text-muted">None yet. Add someone below.</p>}
        {friends.map((p) => (
          <Row key={p.id} card={cardOf(p)}>
            <Link href={`/messages/${p.id}`} className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              Message
            </Link>
            <ActionButton action={removeFriendAction} field="id" value={p.friendshipId!} label="Remove" />
          </Row>
        ))}
      </Group>

      <Group title="Everyone">
        {others.length === 0 && <p className="text-sm text-muted">Nobody else here yet.</p>}
        {others.map((p) => (
          <Row key={p.id} card={cardOf(p)}>
            <Link href={`/messages/${p.id}`} className="rounded-md border border-line px-3 py-1.5 text-sm">
              Message
            </Link>
            {p.relation === "sent" ? (
              <ActionButton action={removeFriendAction} field="id" value={p.friendshipId!} label="Cancel request" />
            ) : (
              <ActionButton action={sendFriendRequestAction} field="userId" value={p.id} label="Add friend" primary />
            )}
          </Row>
        ))}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-medium">{title}</h2>
      <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">{children}</ul>
    </section>
  );
}

// A member's small card (click → their profile) with buttons beside it.
function Row({ card, children }: { card: Pick<Card, "id" | "name" | "callsign" | "look">; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
      <Link href={`/members/${card.id}`} className="min-w-0 flex-1">
        <PlayerCard name={card.name} callsign={card.callsign} look={card.look} size="compact" />
      </Link>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </li>
  );
}
