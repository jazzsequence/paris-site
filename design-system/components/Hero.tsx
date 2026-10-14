import { ButtonLink } from "./Button";

export function Hero({ image, kicker, title, blurb }: { image: string; kicker: string; title: string; blurb: string }) {
  return (
    <section className="relative isolate grid min-h-[80vh] items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover object-top" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/60 to-transparent" aria-hidden />
      <div className="max-w-3xl space-y-5 px-6 pb-16 md:px-12">
        <p className="font-gothic text-3xl text-magenta">{kicker}</p>
        <h1 className="text-chrome font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] md:text-8xl">{title}</h1>
        <p className="max-w-xl text-lg text-muted">{blurb}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/tour">Tour dates</ButtonLink>
          <ButtonLink href="/listen" variant="outline">Listen</ButtonLink>
        </div>
      </div>
    </section>
  );
}
