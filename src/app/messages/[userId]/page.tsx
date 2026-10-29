// "/messages/<member id>" — a private chat between two members. Nobody else can open it; a block closes it.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MessageForm } from "@/components/messages/MessageForm";
import { AutoRefresh } from "@/components/ui/AutoRefresh";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { getUser } from "@/lib/session";
import { PlayerCard } from "@/components/profile/PlayerCard";
import { isBlocked } from "@/lib/blocks";
import { areFriends } from "@/lib/friends";
import { getCard } from "@/lib/profiles";
import { listConversation, markRead } from "@/lib/messages";
import { onlineIds } from "@/lib/presence";
import { timeAgo } from "@/lib/time";

export const metadata: Metadata = { title: "Messages", robots: { index: false } };

export default function MessagesPage({ params }: PageProps<"/messages/[userId]">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Link href="/friends" className="text-sm text-muted hover:text-foreground">← Friends</Link>
        <Suspense fallback={<p className="mt-6 text-muted">Loading chat…</p>}>
          <Chat params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function Chat({ params }: Pick<PageProps<"/messages/[userId]">, "params">) {
  const me = await getUser();
  if (!me) return <SignInPrompt />;
  const friend = await getCard((await params).userId);
  // No such person, yourself, or a block either way? Act like the page doesn't exist.
  if (!friend || friend.id === me.id || (await isBlocked(me.id, friend.id))) notFound();

  await markRead(me.id, friend.id);
  const [messages, friends] = await Promise.all([listConversation(me.id, friend.id), areFriends(me.id, friend.id)]);
  const online = friends ? await onlineIds([friend.id]) : null; // online status is shared with friends only

  return (
    <>
      <h1 className="sr-only">Chat with {friend.name}</h1>
      <Link href={`/members/${friend.id}`} className="mt-4 mb-2 block">
        <PlayerCard name={friend.name} callsign={friend.callsign} look={friend.look} size="compact" />
      </Link>
      {online ? (
        <p className="mb-6 flex items-center gap-2 text-sm text-muted">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${online.has(friend.id) ? "bg-green-500" : "border border-muted"}`} />
          {online.has(friend.id) ? "Online" : "Offline"}
        </p>
      ) : (
        <p className="mb-6 text-sm text-muted">Not friends yet.</p>
      )}

      <ul className="mb-6 flex flex-col gap-2">
        {messages.length === 0 && <li className="text-muted">No messages yet. Say hi.</li>}
        {messages.map((m) => {
          const mine = m.fromId === me.id;
          return (
            <li key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <p
                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 ${mine ? "bg-foreground text-background" : "border border-line"}`}
              >
                {m.body}
              </p>
              <span className="mt-1 text-xs text-muted">{timeAgo(m.createdAt)}</span>
            </li>
          );
        })}
      </ul>

      <MessageForm to={friend.id} />
      <AutoRefresh seconds={5} />
    </>
  );
}
