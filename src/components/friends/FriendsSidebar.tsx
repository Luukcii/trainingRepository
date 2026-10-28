"use client"; // needs the browser: it pings the server on a timer and opens/closes

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PresenceResponse } from "@/app/api/presence/route";

const POLL_MS = 30 * 1000;
type Data = Extract<PresenceResponse, { signedIn: true }>;

export function FriendsSidebar() {
  const pathname = usePathname();
  const [data, setData] = useState<Data | null>(null);
  const [open, setOpen] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches);

  // Heartbeat: check in now, then every 30 s while the tab is visible. Re-check after each navigation (e.g. logging in).
  useEffect(() => {
    async function beat() {
      if (document.hidden) return;
      const res = await fetch("/api/presence", { cache: "no-store" }).catch(() => null);
      if (!res?.ok) return;
      const json: PresenceResponse = await res.json();
      if (!json.signedIn) {
        clearInterval(timer); // visitors don't need a heartbeat
        setData(null);
        return;
      }
      setData(json);
    }
    const timer = setInterval(beat, POLL_MS);
    beat();
    document.addEventListener("visibilitychange", beat);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", beat);
    };
  }, [pathname]);

  if (!data) return null;
  const onlineCount = data.friends.filter((f) => f.online).length;
  const alerts = data.pending + data.friends.reduce((sum, f) => sum + f.unread, 0);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-sm shadow-lg"
      >
        <Dot online={onlineCount > 0} /> Friends · {onlineCount} online
        {alerts > 0 && <Badge n={alerts} />}
      </button>
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

      <ul className="flex-1 overflow-y-auto p-2">
        {data.friends.length === 0 && <li className="p-2 text-sm text-muted">No friends yet.</li>}
        {data.friends.map((f) => (
          <li key={f.id}>
            <Link
              href={`/messages/${f.id}`}
              prefetch={false}
              className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-line ${pathname === `/messages/${f.id}` ? "bg-line" : ""}`}
            >
              <Dot online={f.online} />
              <span className="flex-1 truncate">{f.name}</span>
              {f.unread > 0 && <Badge n={f.unread} />}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/friends" className="flex items-center justify-between border-t border-line px-4 py-3 text-sm hover:bg-line">
        Find friends
        {data.pending > 0 && <span className="text-muted">{data.pending} request{data.pending === 1 ? "" : "s"}</span>}
      </Link>
    </aside>
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
