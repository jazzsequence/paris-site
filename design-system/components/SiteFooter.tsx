import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="space-y-3 border-t border-line px-6 py-10 text-sm text-muted">
      <Wordmark />
      <p>Hostile Takeover. Released through Interscope Records.</p>
      <p className="text-dim">© 1997 PARIS. All rights reserved.</p>
    </footer>
  );
}
