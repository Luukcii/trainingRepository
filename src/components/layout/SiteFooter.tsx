import Link from "next/link";
import { siteName } from "./site-nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          © {siteName}
        </p>
        <Link href="/admin" className="hover:text-foreground">
          Admin
        </Link>
      </div>
    </footer>
  );
}
