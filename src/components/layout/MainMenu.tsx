// Desktop: a row of links. Mobile: a <details> dropdown — built into HTML, so it needs zero JavaScript.
import Link from "next/link";
import { siteNav } from "./site-nav";

export function MainMenu() {
  const links = siteNav.map((item) => (
    <li key={item.href}>
      <Link href={item.href} className="block py-2 text-muted hover:text-foreground">
        {item.label}
      </Link>
    </li>
  ));

  return (
    <nav aria-label="Main">
      <ul className="hidden gap-6 sm:flex">{links}</ul>

      <details className="relative sm:hidden">
        <summary className="cursor-pointer list-none rounded px-2 py-1 text-muted hover:text-foreground">
          Menu
        </summary>
        <ul className="absolute right-0 mt-2 w-40 rounded-lg border border-line bg-background px-4 py-2 shadow-lg">
          {links}
        </ul>
      </details>
    </nav>
  );
}
