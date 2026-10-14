import { AppLink } from "./AppLink";

export type TrackRowProps = {
  number: number;
  title: string;
  duration?: string;
  /** No audio uploaded yet: the row stays, playback and download are unavailable. */
  hasAudio?: boolean;
  lyricsHref?: string;
  playing?: boolean;
  onPlay?: () => void;
  downloadHref?: string;
  /** Shown when there is no audio, e.g. a song that only has lyrics here. */
  unavailableLabel?: string;
};

export function TrackRow({ number, title, duration, hasAudio = true, lyricsHref, playing, onPlay, downloadHref, unavailableLabel = "Audio unavailable" }: TrackRowProps) {
  return (
    <li
      className={`grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-line px-2 py-3 ${
        playing ? "bg-raised" : ""
      }`}
    >
      <span className={`font-display text-sm tabular-nums ${playing ? "text-magenta" : "text-muted"}`}>
        {String(number).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <p className={`truncate font-medium ${hasAudio ? "" : "text-muted"}`}>{title}</p>
        {!hasAudio && <p className="text-xs uppercase tracking-widest text-dim">{unavailableLabel}</p>}
      </div>
      <div className="flex items-center gap-4 text-sm">
        {lyricsHref && (
          <AppLink href={lyricsHref} className="text-violet underline-offset-4 hover:underline">
            Lyrics
          </AppLink>
        )}
        {hasAudio && (
          <>
            <span className="tabular-nums text-muted">{duration}</span>
            <button
              type="button"
              onClick={onPlay}
              aria-label={`Play ${title}`}
              className="grid size-9 place-items-center rounded-full border border-cyan text-cyan hover:bg-cyan hover:text-void"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <a href={downloadHref ?? "#"} download aria-label={`Download ${title}`} className="text-muted hover:text-text">
              <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2" aria-hidden>
                <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
              </svg>
            </a>
          </>
        )}
      </div>
    </li>
  );
}
