// The tabs that link the faction-war pages together.
import Link from "next/link";

const tabs = [
  { key: "home", href: "/war", label: "Factions" },
  { key: "guide", href: "/war/rules", label: "Player's guide" },
  { key: "full", href: "/war/rules/full", label: "Full rulebook" },
  { key: "map", href: "/war/map", label: "War map" },
  { key: "staff", href: "/war/staff", label: "Staff" },
] as const;

export function WarNav({ current }: { current: (typeof tabs)[number]["key"] }) {
  return (
    <nav aria-label="Faction war" className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === current ? "page" : undefined}
          className={`rounded-full border px-4 py-2 text-sm ${
            tab.key === current ? "border-foreground bg-foreground text-background" : "border-line text-muted hover:text-foreground"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
