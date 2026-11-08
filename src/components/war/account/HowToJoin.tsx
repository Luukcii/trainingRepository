// The steps to a faction-war account. God (the Discord bot) does the proving, so there's no open sign-up form.
import Link from "next/link";

export function HowToJoin() {
  return (
    <ol className="list-decimal space-y-2 pl-5">
      <li>
        In the HAFW Discord server, type <code className="rounded bg-line px-1.5 py-0.5">/war join</code>.
      </li>
      <li>God makes your account and privately gives you a password and a link.</li>
      <li>
        On the <Link href="/war/join" className="underline">sign-up page</Link>, enter your Discord username and God&apos;s
        password. You can choose your own password there.
      </li>
      <li>Pick your faction. Lost your password? Type <code className="rounded bg-line px-1.5 py-0.5">/war password</code>.</li>
    </ol>
  );
}
