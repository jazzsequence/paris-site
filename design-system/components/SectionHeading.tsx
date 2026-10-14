export function SectionHeading({ kicker, children }: { kicker?: string; children: string }) {
  return (
    <header className="space-y-2">
      {kicker && (
        <p className="font-gothic text-2xl text-magenta">
          {kicker}
        </p>
      )}
      <h2 className="text-chrome font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.04em] md:text-6xl">
        {children}
      </h2>
      <span className="block h-px w-24 bg-[image:var(--grad-neon)]" aria-hidden />
    </header>
  );
}
