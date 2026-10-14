import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { TrackList } from "../../../components/site/track-list";
import { ButtonLink } from "../../../design-system/components/Button";
import { SectionHeading } from "../../../design-system/components/SectionHeading";
import { getCatalog, getFeaturedAlbum } from "../../../lib/site/catalog";

export const metadata: Metadata = {
  title: "Well Enough",
  description: "Well Enough, the debut LP from PARIS, out now on Hostile Takeover / Interscope.",
  openGraph: { images: ["/images/well-enough-cover.jpg"] },
};
export const revalidate = 300;

export default async function WellEnough() {
  const featured = getFeaturedAlbum();
  const album = (await getCatalog()).find((a) => a.slug === featured.slug);
  if (!album) return null;
  return (
    <Page>
      <div className="grid items-end gap-10 md:grid-cols-[22rem_1fr]">
        <img src={album.cover} alt={`${album.title} cover art`} className="w-full rounded-card border border-line shadow-glow-magenta" />
        <div className="space-y-5">
          <p className="font-gothic text-3xl text-magenta">The debut LP</p>
          <h1 className="text-chrome font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] md:text-7xl">
            {album.title}
          </h1>
          <p className="max-w-xl text-lg text-muted">{album.blurb}</p>
          <p className="text-sm text-dim">Hostile Takeover / Interscope Records · {album.year}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/listen#well-enough">Listen</ButtonLink>
            <ButtonLink href="/tour" variant="outline">Tour dates</ButtonLink>
          </div>
        </div>
      </div>
      <section className="space-y-6">
        <SectionHeading kicker="Track list">{`${album.tracks.length} songs`}</SectionHeading>
        <TrackList tracks={album.tracks} />
      </section>
      <section className="grid gap-6 sm:grid-cols-2">
        <img src="/images/well-enough-back.jpg" alt="Back cover and track listing" className="w-full rounded-card border border-line" />
        <img src="/images/inside-cover.png" alt="Inside cover artwork" className="w-full rounded-card border border-line" />
      </section>
    </Page>
  );
}
