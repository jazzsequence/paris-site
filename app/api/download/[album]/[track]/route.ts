import { audioFile, audioUrl, getAlbum } from "../../../../../lib/site/catalog";

/**
 * Cross-origin `download` attributes are ignored by browsers, so downloads go through here to
 * get a Content-Disposition. Only tracks in the catalog resolve, so this is not an open proxy.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ album: string; track: string }> }) {
  const { album: albumSlug, track: trackSlug } = await params;
  const album = getAlbum(albumSlug);
  const track = album?.tracks.find((t) => t.slug === trackSlug);
  if (!album || !track) return new Response("Not found", { status: 404 });

  const upstream = await fetch(audioUrl(album.slug, track));
  if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

  const length = upstream.headers.get("content-length");
  const filename = `PARIS - ${track.title.replace(/[^\w .'’-]/g, "")}${audioFile(track).slice(-4)}`;
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mp4",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      ...(length ? { "Content-Length": length } : {}),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
