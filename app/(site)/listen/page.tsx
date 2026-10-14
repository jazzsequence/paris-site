import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { TrackList } from "../../../components/site/track-list";
import { SectionHeading } from "../../../design-system/components/SectionHeading";
import { getCatalog } from "../../../lib/site/catalog";

export const metadata: Metadata = { title: "Listen", description: "Stream and download PARIS." };
export const revalidate = 300;

export default async function Listen() {
  const catalog = await getCatalog();
  return (
    <Page>
      <SectionHeading as="h1" kicker="Music">Listen</SectionHeading>
      {catalog.map((album) => (
        <section key={album.slug} id={album.slug} className="grid gap-8 md:grid-cols-[16rem_1fr]">
          <div className="space-y-3">
            <img src={album.cover} alt={`${album.title} cover art`} className="w-full rounded-card border border-line" />
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-[-0.03em]">{album.title}</h2>
            <p className="text-sm text-muted">
              {album.year ? `${album.kind} · ${album.year}` : album.kind}
            </p>
            <p className="text-sm text-muted">{album.blurb}</p>
          </div>
          <TrackList tracks={album.tracks} />
        </section>
      ))}
    </Page>
  );
}
