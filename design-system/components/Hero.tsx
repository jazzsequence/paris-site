import { ButtonLink } from "./Button";

export type HeroAction = { label: string; href: string; variant?: "primary" | "outline" };

const DEFAULT_ACTIONS: HeroAction[] = [
  { label: "Tour dates", href: "/tour" },
  { label: "Listen", href: "/listen", variant: "outline" },
];

export function Hero({
  image,
  kicker,
  title,
  blurb,
  actions = DEFAULT_ACTIONS,
}: {
  image: string;
  kicker: string;
  title: string;
  blurb: string;
  /** Buttons under the blurb. Defaults to Tour dates and Listen. */
  actions?: HeroAction[];
}) {
  return (
    // The photo is portrait and the hero is landscape, so only a slice of it shows. Height follows width
    // (56vw) so the face stays in frame on wide monitors, and the fade is limited to the bottom third so it
    // never reaches the face. A separate left shade keeps the title readable over the hair.
    <section className="relative isolate grid min-h-[max(80vh,56vw)] items-end overflow-hidden">
      <img src={image} alt="" width={1024} height={1536} fetchPriority="high" decoding="async" className="absolute inset-0 -z-20 size-full object-cover object-[50%_6%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/70 via-[14%] to-transparent to-[34%]" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/75 via-void/25 via-[40%] to-transparent to-[60%]" aria-hidden />
      <div className="max-w-3xl space-y-5 px-6 pb-16 md:px-12">
        <p className="font-gothic text-3xl text-magenta">{kicker}</p>
        <h1 className="text-chrome font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] md:text-8xl">{title}</h1>
        <p className="max-w-xl text-lg text-muted">{blurb}</p>
        <div className="flex flex-wrap gap-3">
          {actions.map((a) => (
            <ButtonLink key={`${a.label}-${a.href}`} href={a.href} variant={a.variant ?? "primary"}>
              {a.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
