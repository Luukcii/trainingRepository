// "/friends" — requests, your friends, and everyone you could add. Members only.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { requireUser } from "@/lib/session";
import { membersWithRelation } from "@/lib/friends";
import { acceptFriendAction, removeFriendAction, sendFriendRequestAction } from "./actions";

export const metadata: Metadata = { title: "Friends", robots: { index: false } };

export default function FriendsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Friends</h1>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <FriendsLists />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function FriendsLists() {
  const me = await requireUser();
  const people = await membersWithRelation(me.id);
  const requests = people.filter((p) => p.relation === "received");
  const friends = people.filter((p) => p.relation === "friends");
  const others = people.filter((p) => p.relation === "none" || p.relation === "sent");

  return (
    <div className="flex flex-col gap-10">
      {requests.length > 0 && (
        <Group title="Friend requests">
          {requests.map((p) => (
            <Row key={p.id} name={p.name}>
              <ActionButton action={acceptFriendAction} field="id" value={p.friendshipId!} label="Accept" primary />
              <ActionButton action={removeFriendAction} field="id" value={p.friendshipId!} label="Decline" />
            </Row>
          ))}
        </Group>
      )}

      <Group title="Your friends">
        {friends.length === 0 && <p className="text-sm text-muted">None yet. Add someone below.</p>}
        {friends.map((p) => (
          <Row key={p.id} name={p.name}>
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
          <Row key={p.id} name={p.name}>
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

function Row({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="truncate">{name}</span>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </li>
  );
}

// A one-button form: works without any browser JavaScript.
function ActionButton(props: { action: (form: FormData) => Promise<void>; field: string; value: string; label: string; primary?: boolean }) {
  return (
    <form action={props.action}>
      <input type="hidden" name={props.field} value={props.value} />
      <button
        type="submit"
        className={props.primary ? "rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background" : "rounded-md border border-line px-3 py-1.5 text-sm"}
      >
        {props.label}
      </button>
    </form>
  );
}
