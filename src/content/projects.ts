// Max's projects, in one list. It feeds the Work cards, each project's page, and the review checks.
// The slug is the project's permanent id in links and in the database: change titles freely, not slugs.
export const projects = [
  { slug: "the-good-book", title: "The Good Book", blurb: "What it is, in one line." },
  { slug: "project-two", title: "Project two", blurb: "What it is, in one line." },
  { slug: "project-three", title: "Project three", blurb: "What it is, in one line." },
];

export function findProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
