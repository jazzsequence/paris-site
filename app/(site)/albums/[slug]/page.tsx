import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Page } from "../../../../components/site/section";
import { TrackList } from "../../../../components/site/track-list";
import { ButtonLink } from "../../../../design-system/components/Button";
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
  return (
    <Page>
      <div className="grid items-end gap-10 md:grid-cols-[20rem_1fr]">
        <img src={album.cover} alt={`${album.title} cover art`} className="w-full rounded-card border border-line" />
        <div className="space-y-5">
          <p className="font-gothic text-3xl text-magenta">{released ? album.kind : "Unreleased"}</p>
          <h1 className="text-chrome font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] md:text-7xl">
            {album.title}
          </h1>
          <p className="max-w-xl text-lg text-muted">{album.blurb}</p>
          <p className="text-sm text-dim">
            {released ? `${album.year} · ` : ""}
            {album.tracks.length > 0 ? `${album.tracks.length} songs` : "No recordings yet"}
          </p>
          <ButtonLink href="/albums" variant="outline">All albums</ButtonLink>
        </div>
      </div>
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em]">Track list</h2>
        {album.tracks.length > 0 ? (
          <TrackList tracks={album.tracks} />
        ) : (
        <p className="border border-line bg-surface px-6 py-5 text-muted">
          Nothing here yet. Recordings with no public release will be listed on this page.
        </p>
        )}
      </section>
    </Page>
  );
}
