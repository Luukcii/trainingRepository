// "/war/login" — faction-war login with Discord username + password.
import type { Metadata } from "next";
import { Suspense } from "react";
import { WarHeader, WarFooter } from "@/components/war/WarHeader";
import { WarNav } from "@/components/war/WarNav";
import { WarLoginForm } from "@/components/war/account/WarLoginForm";
import { HowToJoin } from "@/components/war/account/HowToJoin";

export const metadata: Metadata = { title: "Faction War — Log in", robots: { index: false } };

// Only ever send people on to a page of our own war section: "/war…", never "//other-site.com".
function safeNext(value: string | string[] | undefined) {
  const next = typeof value === "string" ? value : "";
  return /^\/war(\/[a-z0-9-]*)*$/.test(next) ? next : "/war";
}

export default function WarLoginPage({ searchParams }: PageProps<"/war/login">) {
  return (
    <>
      <WarHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
        <WarNav current="home" />
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Log in to the war</h1>
        <Suspense fallback={null}>
          <LoginBody searchParams={searchParams} />
        </Suspense>
        <section className="mt-10 space-y-3 text-sm text-muted">
          <h2 className="font-medium text-foreground">No account yet?</h2>
          <HowToJoin />
        </section>
      </main>
      <WarFooter />
    </>
  );
}

async function LoginBody({ searchParams }: Pick<PageProps<"/war/login">, "searchParams">) {
  const params = await searchParams;
  return <WarLoginForm next={safeNext(params.next)} />;
}
