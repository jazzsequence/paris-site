import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Page } from "../../../../components/site/section";
import { LyricsBlock } from "../../../../design-system/components/LyricsBlock";
import { albumTitle } from "../../../../lib/site/catalog";
import { getLyric, getLyrics } from "../../../../lib/site/lyrics";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getLyrics()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lyric = await getLyric((await params).slug);
  return lyric ? { title: `${lyric.title} lyrics`, description: `Lyrics to ${lyric.title} by PARIS.` } : {};
}

export default async function LyricPage({ params }: Props) {
  const lyric = await getLyric((await params).slug);
  if (!lyric) notFound();
  return (
    <Page narrow>
      <LyricsBlock title={lyric.title} album={albumTitle(lyric.album)} sections={lyric.sections} />
      <a href="/lyrics" className="inline-block text-sm text-violet underline-offset-4 hover:underline">
        All lyrics
      </a>
    </Page>
  );
}
