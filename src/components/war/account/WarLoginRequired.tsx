// What a logged-out visitor sees instead of a locked war page (map, staff). The rules stay public.
// This is only the message: each page decides on the server, itself, whether to show it.
import Link from "next/link";
import { HowToJoin } from "./HowToJoin";

export function WarLoginRequired({ what, next }: { what: string; next: string }) {
  return (
    <section className="space-y-4">
      <p>Log in to see {what}. It&apos;s for Faction War players only.</p>
      <Link href={`/war/login?next=${next}`} className="inline-block rounded-md bg-foreground px-4 py-2 font-medium text-background">
        Log in
      </Link>
      <p className="pt-2 text-sm text-muted">No account yet? To join:</p>
      <HowToJoin />
    </section>
  );
}
