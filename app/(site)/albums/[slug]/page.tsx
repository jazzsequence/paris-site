import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Page } from "../../../../components/site/section";
import { TrackList } from "../../../../components/site/track-list";
import { ButtonLink } from "../../../../design-system/components/Button";
import { SectionHeading } from "../../../../design-system/components/SectionHeading";
import { albums, getAlbum, getCatalog, getFeaturedAlbum } from "../../../../lib/site/catalog";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export const generateStaticParams = () => albums.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = getAlbum((await params).slug);
  return album
    ? { title: album.title, description: album.blurb, openGraph: { images: [album.cover] } }
    : {};
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  // The latest release has its own feature page; keep one canonical URL for it.
  if (slug === getFeaturedAlbum().slug) permanentRedirect("/well-enough");
  const album = (await getCatalog()).find((a) => a.slug === slug);
  if (!album) notFound();
  const released = album.year !== undefined;
  const available = album.tracks.filter((t) => t.hasAudio).length;
  return (
    <Page>
      <div className="grid items-end gap-10 md:grid-cols-[20rem_1fr]">
        <img src={album.cover} alt={`${album.title} cover art`} className="w-full rounded-card border border-line" />
        <div className="space-y-5">
          <p className="font-gothic text-3xl text-magenta">{released ? album.kind : "Not out yet"}</p>
          <h1 className="text-chrome font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] md:text-7xl">
            {album.title}
          </h1>
          <p className="max-w-xl text-lg text-muted">{album.blurb}</p>
          <p className="text-sm text-dim">
            {released ? `${album.year} · ` : ""}
            {album.tracks.length} songs{released ? "" : ` · ${available} with audio`}
          </p>
          <ButtonLink href="/albums" variant="outline">All albums</ButtonLink>
        </div>
      </div>
      <section className="space-y-6">
        <SectionHeading kicker="Track list">{released ? "Songs" : "On the way"}</SectionHeading>
        <TrackList tracks={album.tracks} />
      </section>
    </Page>
  );
}
