"use client"; // needs the browser: it pings the server on a timer, opens/closes, and pops up notifications

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PresenceResponse } from "@/app/api/presence/route";
import { Emblem } from "@/components/profile/Emblem";

const POLL_MS = 15 * 1000; // how fast new messages show up; each check is one small request
const TOAST_MS = 6 * 1000;
type Data = Extract<PresenceResponse, { signedIn: true }>;
type Person = Data["others"][number];
type Toast = { key: number; text: string; href: string; person?: Person };

export function FriendsSidebar() {
  const pathname = usePathname();
  const [data, setData] = useState<Data | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [open, setOpen] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches);
  const previous = useRef<Data | null>(null); // last check's numbers, to spot what's new

  // Heartbeat: check in now, then every 15 s while the tab is visible. Re-check after each navigation (e.g. logging in).
  useEffect(() => {
    async function beat() {
      if (document.hidden) return;
      const res = await fetch("/api/presence", { cache: "no-store" }).catch(() => null);
      if (!res?.ok) return;
      const json: PresenceResponse = await res.json();
      if (!json.signedIn) {
        clearInterval(timer); // visitors don't need a heartbeat
        previous.current = null;
        setData(null);
        return;
      }
      const fresh = whatsNew(previous.current, json, pathname);
      previous.current = json;
      setData(json);
      if (fresh.length > 0) setToasts((t) => [...t, ...fresh].slice(-3));
    }
    const timer = setInterval(beat, POLL_MS);
    beat();
    document.addEventListener("visibilitychange", beat);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", beat);
    };
  }, [pathname]);

  // Each pop-up disappears on its own after a few seconds.
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => setToasts((t) => t.slice(1)), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (!data) return null;
  const onlineCount = data.friends.filter((f) => f.online).length;
  const unreadTotal = [...data.friends, ...data.others].reduce((sum, p) => sum + p.unread, 0);
  const alerts = data.pending + unreadTotal;
  const dismiss = (key: number) => setToasts((t) => t.filter((x) => x.key !== key));

  if (!open) {
    return (
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
        <Toasts toasts={toasts} onDismiss={dismiss} />
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-sm shadow-lg"
        >
          <Dot online={onlineCount > 0} /> Friends · {onlineCount} online
          {alerts > 0 && <Badge n={alerts} />}
        </button>
      </div>
    );
  }

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-40 flex w-64 flex-col border-l border-line bg-background shadow-lg">
      <div className="flex h-14 items-center justify-between border-b border-line px-4">
        <span className="font-medium">Friends</span>
        <button onClick={() => setOpen(false)} aria-label="Close friends" className="text-muted hover:text-foreground">
          ✕
        </button>
      </div>

      <div className="p-2 empty:hidden">
        <Toasts toasts={toasts} onDismiss={dismiss} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <ul>
          {data.friends.length === 0 && <li className="p-2 text-sm text-muted">No friends yet.</li>}
          {data.friends.map((f) => (
            <PersonLink key={f.id} person={f} active={pathname === `/messages/${f.id}`}>
              <Dot online={f.online} />
            </PersonLink>
          ))}
        </ul>

        {data.others.length > 0 && (
          <>
            <p className="mt-4 px-2 pb-1 text-xs tracking-wide text-muted uppercase">Messages</p>
            <ul>
              {data.others.map((p) => (
                <PersonLink key={p.id} person={p} active={pathname === `/messages/${p.id}`} />
              ))}
            </ul>
          </>
        )}
      </div>

      <Link href="/friends" className="flex items-center justify-between border-t border-line px-4 py-3 text-sm hover:bg-line">
        Find friends
        {data.pending > 0 && <span className="text-muted">{data.pending} request{data.pending === 1 ? "" : "s"}</span>}
      </Link>
      <Link href="/profile" className="border-t border-line px-4 py-3 text-sm hover:bg-line">
        Your player card
      </Link>
    </aside>
  );
}

// Compare this check with the last one. More unread from someone, or a new friend request = a pop-up.
// The first check after the page loads only sets the baseline, so old messages don't pop up again.
let toastKey = 0;
function whatsNew(before: Data | null, now: Data, pathname: string): Toast[] {
  if (!before) return [];
  const out: Toast[] = [];
  const unreadBefore = new Map([...before.friends, ...before.others].map((p) => [p.id, p.unread]));
  for (const p of [...now.friends, ...now.others]) {
    const href = `/messages/${p.id}`;
    if (p.unread > (unreadBefore.get(p.id) ?? 0) && pathname !== href) {
      out.push({ key: ++toastKey, text: `New message from ${p.name}`, href, person: p });
    }
  }
  if (now.pending > before.pending) out.push({ key: ++toastKey, text: "New friend request", href: "/friends" });
  return out;
}

function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (key: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <ul aria-live="polite" className="flex w-60 flex-col gap-2">
      {toasts.map((t) => (
        <li key={t.key} className="flex items-center gap-2 rounded-lg border border-line bg-background p-2 text-sm shadow-lg">
          {t.person ? <Emblem emblem={t.person.emblem} color={t.person.color} className="h-7 w-7 shrink-0" /> : <span className="px-1">👋</span>}
          <Link href={t.href} onClick={() => onDismiss(t.key)} className="flex-1 hover:underline">
            {t.text}
          </Link>
          <button onClick={() => onDismiss(t.key)} aria-label="Dismiss" className="text-muted hover:text-foreground">
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}

function PersonLink({ person, active, children }: { person: Person; active: boolean; children?: React.ReactNode }) {
  return (
    <li>
      <Link
        href={`/messages/${person.id}`}
        prefetch={false}
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-line ${active ? "bg-line" : ""}`}
      >
        <Emblem emblem={person.emblem} color={person.color} className="h-6 w-6 shrink-0" />
        <span className="flex-1 truncate">{person.name}</span>
        {person.unread > 0 && <Badge n={person.unread} />}
        {children}
      </Link>
    </li>
  );
}

function Dot({ online }: { online: boolean }) {
  return (
    <span
      aria-label={online ? "online" : "offline"}
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${online ? "bg-green-500" : "border border-muted"}`}
    />
  );
}

function Badge({ n }: { n: number }) {
  return <span className="rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">{n}</span>;
}
