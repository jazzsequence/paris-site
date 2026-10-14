"use client";

import { TrackRow } from "../../design-system/components/TrackRow";
import type { CatalogTrack } from "../../lib/site/catalog";
import { usePlayer, type PlayerTrack } from "./player";

const toPlayer = (t: CatalogTrack): PlayerTrack => ({
  id: `${t.album}/${t.slug}`,
  title: t.title,
  album: t.albumTitle,
  cover: t.cover,
  src: t.src,
});

export function TrackList({ tracks }: { tracks: CatalogTrack[] }) {
  const { play, current, playing } = usePlayer();
  const queue = tracks.filter((t) => t.hasAudio).map(toPlayer);
  return (
    <ol className="border-t border-line">
      {tracks.map((t) => {
        const p = toPlayer(t);
        return (
          <TrackRow
            key={t.slug}
            number={t.number}
            title={t.title}
            hasAudio={t.hasAudio}
            lyricsHref={t.hasLyrics ? `/lyrics/${t.slug}` : undefined}
            playing={current?.id === p.id && playing}
            onPlay={() => play(p, queue)}
            downloadHref={t.downloadHref}
          />
        );
      })}
    </ol>
  );
}
