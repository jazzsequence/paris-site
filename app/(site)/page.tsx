import { AlbumCard } from "../../design-system/components/AlbumCard";
import { Hero } from "../../design-system/components/Hero";
import { SectionHeading } from "../../design-system/components/SectionHeading";
import { TourDateRow } from "../../design-system/components/TourDateRow";
import { ButtonLink } from "../../design-system/components/Button";
import { Page } from "../../components/site/section";
import { albums, getFeaturedAlbum } from "../../lib/site/catalog";
import { dateParts, shows } from "../../lib/site/tour";

export default function Home() {
  const latest = getFeaturedAlbum();
  return (
    <>
      <Hero
        image="/images/paris-on-stage.png"
        kicker="New album"
        title={latest.title}
        blurb="The new album, out now on Hostile Takeover."
      />
      <Page>
        <section className="space-y-6">
          <SectionHeading kicker="On the road">Tour dates</SectionHeading>
          <ul>
            {shows.slice(0, 4).map((s) => (
              <TourDateRow
                key={s.id}
                {...dateParts(s.date)}
                city={s.city}
                venue={s.venue}
                capacity={s.capacity}
                status={s.status}
                href={`/tickets/${s.id}`}
              />
            ))}
          </ul>
          <ButtonLink href="/tour" variant="outline">All dates</ButtonLink>
        </section>
        <section className="space-y-6">
          <SectionHeading kicker="Music">Albums</SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {albums.map((a) => (
              <AlbumCard
                key={a.slug}
                title={a.title}
                year={a.year}
                cover={a.cover}
                trackCount={a.tracks.length}
                featured={a.featured}
                href={a.featured ? "/well-enough" : `/albums/${a.slug}`}
              />
            ))}
          </div>
        </section>
      </Page>
    </>
  );
}
