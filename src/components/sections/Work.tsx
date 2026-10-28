import { Section } from "@/components/ui/Section";

// Placeholder projects. Later these can come from the database and be edited in /admin.
const projects = [
  { title: "The Good Book", blurb: "What it is, in one line." },
  { title: "Project two", blurb: "What it is, in one line." },
  { title: "Project three", blurb: "What it is, in one line." },
];

export function Work() {
  return (
    <Section id="work" title="Work">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.title} className="rounded-lg border border-line p-5">
            <h3 className="font-medium">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.blurb}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
