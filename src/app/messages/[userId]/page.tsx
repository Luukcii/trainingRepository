// "/messages/<friend id>" — a private chat between two friends. Nobody else can open it.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MessageForm } from "@/components/messages/MessageForm";
import { AutoRefresh } from "@/components/ui/AutoRefresh";
import { requireUser } from "@/lib/session";
import { areFriends, findMember } from "@/lib/friends";
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
  const me = await requireUser();
  const friend = await findMember((await params).userId);
  // Not a friend (or no such person)? Act like the page doesn't exist.
  if (!friend || !(await areFriends(me.id, friend.id))) notFound();

  await markRead(me.id, friend.id);
  const [messages, online] = await Promise.all([listConversation(me.id, friend.id), onlineIds([friend.id])]);

  return (
    <>
      <h1 className="mt-4 mb-6 flex items-center gap-3 text-2xl font-semibold tracking-tight">
        <span className={`inline-block h-3 w-3 rounded-full ${online.has(friend.id) ? "bg-green-500" : "border border-muted"}`} />
        {friend.name}
      </h1>

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
