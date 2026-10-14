import { AppLink } from "./AppLink";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="space-y-3 border-t border-line px-6 py-10 text-sm text-muted">
      <Wordmark />
      <p>Hostile Takeover. Released through Interscope Records.</p>
      <p className="text-dim">© 1997 PARIS. All rights reserved.</p>
      <nav aria-label="Footer">
        <AppLink href="/privacy" className="inline-block py-2 underline underline-offset-4 hover:text-text">
          Privacy
        </AppLink>
      </nav>
    </footer>
  );
}
