"use client";

import { useEffect, useRef, useState } from "react";
import { langOf } from "../lang";
import { assetUrl } from "../asset";

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
  /** Tracks that will play in order. The queue button is hidden when this is empty. */
  queue?: QueueItem[];
  currentId?: string;
  onSelect?: (id: string) => void;
  /** Removes a queue entry. Not offered for the current one. */
  onRemove?: (id: string) => void;
  /** Empties the queue except for the current track. The button shows only when something else is queued. */
  onClear?: () => void;
};

export type QueueItem = { id: string; title: string; subtitle?: string };

/** Persistent bottom player. Lives in the root layout so playback follows the visitor. */
export function PlayerBar({ title, album, cover, elapsed, duration, progress, playing, onToggle, onPrev, onNext, onSeek, queue = [], currentId, onSelect, onRemove, onClear }: PlayerBarProps) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // A long queue opens scrolled to the track that is playing.
  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: "center" });
  }, [open]);

  // Close on outside click; Escape (handled below) returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  return (
    <section
      aria-label="Audio player"
      className="relative grid grid-cols-[auto_1fr] items-center gap-4 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur md:grid-cols-[16rem_1fr_16rem]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <img src={assetUrl(cover)} alt="" width={48} height={48} className="size-12 rounded-card object-cover" />
        <div className="min-w-0">
          <p lang={langOf(title)} className="truncate text-sm font-semibold">{title}</p>
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
      {queue.length > 0 && (
        <div
          ref={wrap}
          // Presentation only: this wrapper just catches Escape from the controls inside it.
          role="presentation"
          className="relative col-span-2 flex justify-end md:col-span-1"
          onKeyDown={(e) => {
            if (e.key === "Escape" && open) {
              setOpen(false);
              toggle.current?.focus();
            }
          }}
        >
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="player-queue"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 py-2 text-xs uppercase tracking-widest text-violet hover:underline"
          >
            Queue
            <span className="tabular-nums text-muted">({queue.length})</span>
          </button>
          {open && (
            <div
              id="player-queue"
              ref={panel}
              role="region"
              aria-label="Queue"
              className="absolute bottom-full right-0 mb-3 max-h-[50vh] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto border border-line bg-raised shadow-glow-magenta"
            >
              {onClear && queue.length > 1 && (
                <div className="flex items-center justify-between border-b border-line px-4 py-2">
                  <span className="text-xs uppercase tracking-widest text-muted">{queue.length} in queue</span>
                  <button
                    type="button"
                    onClick={onClear}
                    className="py-1 text-xs uppercase tracking-widest text-violet hover:underline"
                  >
                    Clear queue
                  </button>
                </div>
              )}
              <ol>
                {queue.map((item, i) => (
                  <li key={item.id} className="flex items-stretch border-b border-line last:border-b-0">
                    <button
                      type="button"
                      aria-current={item.id === currentId ? "true" : undefined}
                      onClick={() => onSelect?.(item.id)}
                      className={`grid min-w-0 flex-1 grid-cols-[2rem_1fr] items-center gap-2 px-4 py-3 text-left hover:bg-surface ${
                        item.id === currentId ? "text-magenta" : "text-text"
                      }`}
                    >
                      <span className="text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span lang={langOf(item.title)} className="block truncate text-sm font-semibold">{item.title}</span>
                        {item.subtitle && <span className="block truncate text-xs text-muted">{item.subtitle}</span>}
                      </span>
                    </button>
                    {onRemove && item.id !== currentId && (
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.title} from queue`}
                        className="grid w-11 place-items-center text-muted hover:bg-surface hover:text-text"
                      >
                        <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2" aria-hidden>
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
