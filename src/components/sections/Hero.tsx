import { CastleScene } from "@/components/ui/CastleScene";

const title = "Hi, I'm Max.";

export function Hero() {
  return (
    <section className="border-b border-line py-16">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-widest text-muted">Portfolio</p>
        <h1>
          {/* Screen readers and search engines read this text; the castle drawing is hidden from them. */}
          <span className="sr-only">{title}</span>
          <CastleScene text={title} className="h-auto w-full" />
        </h1>
        <p className="mt-4 font-stone text-lg text-muted">A short line about what you do goes here.</p>
      </div>
    </section>
  );
}
