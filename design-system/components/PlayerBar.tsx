import { AppLink } from "./AppLink";

export type PlayerBarProps = {
  title: string;
  album: string;
  cover: string;
  elapsed: string;
  duration: string;
  progress: number; // 0-100
  playing?: boolean;
  onToggle?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Called with a 0-100 position when the progress bar is clicked. */
  onSeek?: (percent: number) => void;
};

/** Persistent bottom player. Lives in the root layout so playback follows the visitor. */
export function PlayerBar({ title, album, cover, elapsed, duration, progress, playing, onToggle, onPrev, onNext, onSeek }: PlayerBarProps) {
  return (
    <section
      aria-label="Audio player"
      className="grid grid-cols-[auto_1fr] items-center gap-4 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur md:grid-cols-[16rem_1fr_16rem]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <img src={cover} alt="" className="size-12 rounded-card object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="truncate text-xs text-muted">{album}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-5">
          <button type="button" onClick={onPrev} aria-label="Previous track" className="text-muted hover:text-text">
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden><path d="M6 5h2v14H6zm3.5 7L19 5v14z" /></svg>
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid size-10 place-items-center rounded-full bg-magenta text-void shadow-glow-magenta"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden><path d="M7 5h4v14H7zm6 0h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button type="button" onClick={onNext} aria-label="Next track" className="text-muted hover:text-text">
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden><path d="M16 5h2v14h-2zM5 5l9.5 7L5 19z" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs tabular-nums text-muted">
          <span>{elapsed}</span>
          {/* A real range input (transparent, over the visual bar) so seeking works with a
              keyboard, touch and screen readers, not just a mouse. */}
          <div className="relative flex h-6 flex-1 items-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-cyan">
            <div className="h-2 w-full overflow-hidden rounded-full bg-line" aria-hidden>
              <div className="h-full bg-[image:var(--grad-neon)]" style={{ width: `${progress}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={progress}
              onChange={(e) => onSeek?.(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${elapsed} of ${duration}`}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </div>
          <span>{duration}</span>
        </div>
      </div>
      <div className="hidden justify-end md:flex">
        <AppLink href="/listen" className="text-xs uppercase tracking-widest text-violet hover:underline">
          Queue
        </AppLink>
      </div>
    </section>
  );
}
