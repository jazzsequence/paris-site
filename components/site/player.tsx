"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { PlayerBar } from "../../design-system/components/PlayerBar";

export type PlayerTrack = {
  id: string;
  title: string;
  album: string;
  cover: string;
  src: string;
};

type PlayerState = {
  current?: PlayerTrack;
  playing: boolean;
  /** Start a track; `queue` is the ordered list that next/previous move through. */
  play: (track: PlayerTrack, queue?: PlayerTrack[]) => void;
};

const Ctx = createContext<PlayerState | null>(null);

export function usePlayer(): PlayerState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/**
 * Lives in the root layout so playback continues across navigation. No cookies, no storage,
 * no analytics: state is in memory only and disappears with the tab.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [queue, setQueue] = useState<PlayerTrack[]>([]);
  const [current, setCurrent] = useState<PlayerTrack>();
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ elapsed: 0, duration: 0 });

  const start = useCallback((track: PlayerTrack) => {
    setCurrent(track);
    const el = audio.current;
    if (!el) return;
    el.src = track.src;
    void el.play().catch(() => setPlaying(false));
  }, []);

  const play = useCallback(
    (track: PlayerTrack, q?: PlayerTrack[]) => {
      if (q) setQueue(q);
      if (current?.id === track.id) {
        const el = audio.current;
        if (el?.paused) void el.play();
        else el?.pause();
        return;
      }
      start(track);
    },
    [current, start],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = queue.findIndex((t) => t.id === current?.id);
      const next = queue[i + dir];
      if (next) start(next);
    },
    [queue, current, start],
  );

  // Hardware / lock-screen media keys.
  useEffect(() => {
    if (!current || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: "PARIS",
      album: current.album,
      artwork: [{ src: current.cover }],
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => step(-1));
    navigator.mediaSession.setActionHandler("nexttrack", () => step(1));
  }, [current, step]);

  const value = useMemo(() => ({ current, playing, play }), [current, playing, play]);
  const progress = time.duration ? (time.elapsed / time.duration) * 100 : 0;

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* No crossOrigin attribute: playback and seeking work cross-origin without CORS, so new preview
          or production domains do not need to be added to the bucket's allowed origins. */}
      {/* Songs have no captions to provide; the lyrics page linked from each track is the text alternative. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audio}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime({ elapsed: e.currentTarget.currentTime, duration: e.currentTarget.duration })}
        onLoadedMetadata={(e) => setTime({ elapsed: 0, duration: e.currentTarget.duration })}
        onEnded={() => step(1)}
      />
      {current && (
        <div className="sticky bottom-0 z-40">
          <PlayerBar
            title={current.title}
            album={current.album}
            cover={current.cover}
            elapsed={fmt(time.elapsed)}
            duration={fmt(time.duration)}
            progress={Math.round(progress)}
            playing={playing}
            onToggle={() => (audio.current?.paused ? void audio.current.play() : audio.current?.pause())}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            queue={queue.map((t) => ({ id: t.id, title: t.title, subtitle: t.album }))}
            currentId={current.id}
            onSelect={(id) => {
              const next = queue.find((t) => t.id === id);
              if (next) start(next);
            }}
            onSeek={(pct) => {
              if (audio.current && Number.isFinite(audio.current.duration)) {
                audio.current.currentTime = (pct / 100) * audio.current.duration;
              }
            }}
          />
        </div>
      )}
    </Ctx.Provider>
  );
}
