// The three steps to a faction-war account. The Discord bot does the proving, so there's no open sign-up form.
export function HowToJoin() {
  return (
    <ol className="list-decimal space-y-2 pl-5">
      <li>
        In the HAFW Discord server, type <code className="rounded bg-line px-1.5 py-0.5">/war join</code>.
      </li>
      <li>The bot sends you a private sign-up link. Open it and choose a password (12 characters or more).</li>
      <li>Log in here with your Discord username and that password, then pick your faction.</li>
    </ol>
  );
}
