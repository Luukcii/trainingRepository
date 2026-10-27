import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Admin login</h1>
        <LoginForm />
        <Link href="/" className="mt-6 block text-sm text-muted hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
