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

/** One slot in the queue. The same song can be queued twice, so slots have their own id. */
type Entry = { uid: string; track: PlayerTrack };

type PlayerState = {
  /** Id of the track loaded in the player, playing or paused. */
  currentId?: string;
  playing: boolean;
  /**
   * Play a track. Passing `list` replaces the queue with that list (an album, say). Calling it for the
   * track that is already loaded pauses or resumes it instead.
   */
  play: (track: PlayerTrack, list?: PlayerTrack[]) => void;
  /** Add a track to the end of the queue. Starts nothing if something else is already playing. */
  enqueue: (track: PlayerTrack) => void;
};

const Ctx = createContext<PlayerState | null>(null);

export function usePlayer(): PlayerState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/**
 * Lives in the site layout so playback continues across navigation. No cookies, no storage,
 * no analytics: state is in memory only and disappears with the tab.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const counter = useRef(0);
  const [queue, setQueue] = useState<Entry[]>([]);
  const [currentUid, setCurrentUid] = useState<string>();
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ elapsed: 0, duration: 0 });
  const [announcement, setAnnouncement] = useState("");

  const current = queue.find((e) => e.uid === currentUid)?.track;
  const entry = useCallback((track: PlayerTrack): Entry => ({ uid: `q${++counter.current}`, track }), []);

  /** Make an entry the loaded track. Playback only starts when asked to. */
  const load = useCallback((e: Entry, autoplay: boolean) => {
    setCurrentUid(e.uid);
    const el = audio.current;
    if (!el) return;
    el.src = e.track.src;
    if (autoplay) void el.play().catch(() => setPlaying(false));
  }, []);

  const togglePlayback = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, []);

  const play = useCallback(
    (track: PlayerTrack, list?: PlayerTrack[]) => {
      if (current?.id === track.id) {
        togglePlayback();
        return;
      }
      const entries = (list ?? [track]).map(entry);
      const target = entries.find((e) => e.track.id === track.id) ?? entries[0];
      setQueue(entries);
      load(target, true);
    },
    [current, entry, load, togglePlayback],
  );

  const enqueue = useCallback(
    (track: PlayerTrack) => {
      const e = entry(track);
      setQueue((q) => [...q, e]);
      setAnnouncement(`Added ${track.title} to the queue`);
      // With nothing loaded there is no player bar to hold the queue, so load it without playing.
      if (!current) load(e, false);
    },
    [current, entry, load],
  );

  const removeFromQueue = useCallback((uid: string) => {
    setQueue((q) => {
      const gone = q.find((e) => e.uid === uid);
      if (gone) setAnnouncement(`Removed ${gone.track.title} from the queue`);
      return q.filter((e) => e.uid !== uid);
    });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = queue.findIndex((e) => e.uid === currentUid);
      const next = queue[i + dir];
      if (next) load(next, true);
    },
    [queue, currentUid, load],
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

  const value = useMemo(() => ({ currentId: current?.id, playing, play, enqueue }), [current?.id, playing, play, enqueue]);
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
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
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
            onToggle={togglePlayback}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            queue={queue.map((e) => ({ id: e.uid, title: e.track.title, subtitle: e.track.album }))}
            currentId={currentUid}
            onSelect={(uid) => {
              const e = queue.find((x) => x.uid === uid);
              if (e) load(e, true);
            }}
            onRemove={removeFromQueue}
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
