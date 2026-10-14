import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { AlbumCard } from "../../../design-system/components/AlbumCard";
import { SectionHeading } from "../../../design-system/components/SectionHeading";
import { albums } from "../../../lib/site/catalog";

export const metadata: Metadata = { title: "Albums", description: "The PARIS catalogue." };

export default function Albums() {
  return (
    <Page>
      <SectionHeading as="h1" kicker="Music">Albums</SectionHeading>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {albums.map((a) => (
          <AlbumCard
            key={a.slug}
            title={a.title}
            year={a.year}
            cover={a.cover}
            trackCount={a.tracks.length}
            featured={a.featured}
            headingLevel="h2"
            href={a.featured ? "/well-enough" : `/albums/${a.slug}`}
          />
        ))}
      </div>
    </Page>
  );
}
