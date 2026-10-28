// "/projects/<slug>" — one project and its reviews. The title prerenders; reviews stream in per visit.
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProjectReviews } from "@/components/reviews/ProjectReviews";
import { findProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = findProject((await params).slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = findProject((await params).slug);
  if (!project) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <Link href="/#work" className="text-sm text-muted hover:text-foreground">← All projects</Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-2 mb-10 text-muted">{project.blurb}</p>
        <Suspense fallback={<p className="text-muted">Loading reviews…</p>}>
          <ProjectReviews slug={project.slug} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
