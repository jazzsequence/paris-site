import { Wordmark } from "./Wordmark";
import { AppLink } from "./AppLink";

const links = [
  ["Tour", "/tour"],
  ["Listen", "/listen"],
  ["Albums", "/albums"],
  ["Lyrics", "/lyrics"],
  ["Well Enough", "/well-enough"],
  ["Press", "/press"],
  ["Bio", "/bio"],
  ["Merch", "/merch"],
] as const;

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-void/90 px-6 py-4 backdrop-blur">
      <Wordmark href="/" />
      <nav aria-label="Primary">
        <ul className="flex flex-wrap gap-x-6 gap-y-0 font-display text-xs uppercase tracking-[0.18em]">
          {links.map(([label, href]) => (
            <li key={href}>
              <AppLink
                href={href}
                aria-current={current === href ? "page" : undefined}
                className={`inline-block py-2 hover:text-magenta ${current === href ? "border-b-2 border-magenta text-text" : "text-muted"}`}
              >
                {label}
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
