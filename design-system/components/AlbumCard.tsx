export type AlbumCardProps = {
  title: string;
  /** Omit for unreleased material. */
  year?: number;
  cover: string;
  trackCount: number;
  featured?: boolean;
  href?: string;
};

export function AlbumCard({ title, year, cover, trackCount, featured, href = "#" }: AlbumCardProps) {
  return (
    <a
      href={href}
      className="group block overflow-hidden rounded-card border border-line bg-surface transition hover:border-magenta hover:shadow-glow-magenta"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={cover}
          alt={`${title} cover art`}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        {featured && (
          <span className="absolute left-3 top-3 bg-magenta px-2 py-1 font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-void">
            Latest
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide">{title}</h3>
        <p className="text-sm text-muted">
          {year ?? "Unreleased"} · {trackCount} tracks
        </p>
      </div>
    </a>
  );
}
