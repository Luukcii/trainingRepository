// The Faction War's own header and footer. Max (9 Nov): the war links to nothing on his home page;
// only the home page links into the war. So no portfolio menu, no "Admin" link here.
import Link from "next/link";

export function WarHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
        <Link href="/war" className="font-stone text-xl tracking-wide">
          Faction War
        </Link>
      </div>
    </header>
  );
}

export function WarFooter() {
  return (
    <footer className="border-t border-line">
      <p className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">© Faction War · Holy Alliance</p>
    </footer>
  );
}
