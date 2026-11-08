import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

export function Work() {
  return (
    <Section id="work" title="Work">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          // A link can't sit inside another link, so a project with its own page gets two side by side.
          <li key={p.slug} className="flex h-full flex-col rounded-lg border border-line p-5 hover:border-foreground">
            <Link href={p.href ?? `/projects/${p.slug}`} className="flex-1">
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
            </Link>
            <div className="mt-4 flex gap-4 text-sm">
              {p.href && (
                <Link href={p.href} className="hover:underline">
                  Open →
                </Link>
              )}
              <Link href={`/projects/${p.slug}`} className="hover:underline">
                Reviews →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
