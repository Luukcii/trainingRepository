import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

export function Work() {
  return (
    <Section id="work" title="Work">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="block h-full rounded-lg border border-line p-5 hover:border-foreground">
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              <p className="mt-4 text-sm">Reviews →</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
