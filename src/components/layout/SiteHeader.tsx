import Link from "next/link";
import { MainMenu } from "./MainMenu";
import { siteName } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteName}
        </Link>
        <MainMenu />
      </div>
    </header>
  );
}
