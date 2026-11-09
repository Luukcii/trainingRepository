// Max's projects, in one list. It feeds the Work cards, each project's page, and the review checks.
// The slug is the project's permanent id in links and in the database: change titles freely, not slugs.
// `href` (optional) = where the project itself lives on this site. The card and project page link to it.
type Project = { slug: string; title: string; blurb: string; href?: string };

export const projects: Project[] = [
  { slug: "the-good-book", title: "The Good Book", blurb: "What it is, in one line." },
  { slug: "faction-war", title: "Faction War", blurb: "Samurai, Berserkrs and Crusaders fight for the Holy Alliance.", href: "https://faction-war-steel.vercel.app/war" },
  { slug: "project-two", title: "Project two", blurb: "What it is, in one line." },
  { slug: "project-three", title: "Project three", blurb: "What it is, in one line." },
];

export function findProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
