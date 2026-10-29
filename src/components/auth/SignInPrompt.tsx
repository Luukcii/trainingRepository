// Shown in place of a members-only page when nobody is logged in. Simpler and sturdier than a redirect
// from inside a page that has already started loading.
import Link from "next/link";

export function SignInPrompt() {
  return (
    <div className="mt-6 flex flex-col items-start gap-3 rounded-lg border border-line p-5">
      <p>This page is for members. Log in to see it.</p>
      <Link href="/login" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
        Log in
      </Link>
    </div>
  );
}
