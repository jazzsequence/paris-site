# CLAUDE.md

PARIS artist site. Next.js 16 + P1 (Pantheon Content Publisher / Puck), deployed to Pantheon (`paris-site`),
live domain `paris.jazzsequence.com`. Primary spec: `docs/Project Outline.md` (kept locally, not tracked). Public copy, metadata, alt text,
code comments and docs must never state or hint at anything the outline marks as off-limits. Keep backstory out
of everything committed.

## Commands (pnpm; Node per `.nvmrc`)

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server (needs `.env`, see `.env.example`) |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Required before presenting changes |
| `pnpm build` | Production build; works with placeholder `NEXT_PUBLIC_CSS_SITE_ID` and `CSS_API_KEY` |
| `pnpm test:a11y` | Playwright + axe against the standalone build (run `pnpm build` first; kill any stale server on :3100) |
| `pnpm storybook` / `pnpm build-storybook` | Design system (`design-system/`, config in `.storybook/`) |
| `pnpm sync:registry` | Push Puck registry to P1 (CI does this) |

## Architecture decisions

- **Content split:** lyrics = Markdown in repo; bio, albums, tour dates, merch = P1; images = P1 media;
  audio = Cloudflare R2 bucket served from `music.paris.jazzsequence.com`, listed server-side at build/ISR
  from `<album-slug>/<NN>-<track-slug>.m4a`. Audio is never committed (`music/` is gitignored, and was purged
  from history before the first push).
- **Where content lives right now:** the public pages are code under `app/(site)/` with content in the repo:
  `data/albums.json` (albums, tracks, `unreleased` pseudo-album with no `year`), `data/tour.json`, `data/merch.json`,
  `content/lyrics/*.md` (frontmatter `title`/`album`/`track`, `### Label` sections), `content/press/interview.md`.
  Moving bio/tour/merch into P1 is still open (the P1 site could not be inspected). To add a song: add it to
  `data/albums.json`, upload `<album>/<NN>-<slug>.m4a` to the bucket, add `content/lyrics/<slug>.md` if it has lyrics.
  P1-rendered pages (`app/[...puckPath]`) sit outside the `(site)` layout and have no header/footer/player yet.
- **Tour dates are fictional; venues are real 1997 clubs and theatres, so check each against a source before adding one.** The ticket flow
  (`/tickets/[id]` -> `/ticket?...`) keeps all state in the URL and collects nothing.
- **Songs and lyrics are independent resources.** A track with no lyrics, or lyrics with no audio, is normal.
- **Persistent player** lives in the root layout; no cookies, no tracking, no mailing list.
- **Single Next config:** `next.config.ts` only. The starter's `.mjs` config and the Pantheon template's `.ts`
  config coexisted and Next silently loaded the `.mjs`, dropping `output: "standalone"`. Merged; do not re-add.
  `cacheHandler.mjs` must stay plain JS: the standalone server loads it at runtime.
  `start` must be `node .next/standalone/server.js` (with `copy-standalone` in `build`), never `next start`: that
  ignores `output: standalone` and looks for `cacheHandler.mjs` inside `.next/`, so every request 500s on Pantheon.
- **`NEXT_PUBLIC_CSS_BASE_URL` is required** (`https://ccr.p1.pantheon.io`): the auth routes do not default it and 500 with "Server configuration error" if blank. (The data client does default; the broker does not.)
- **Secrets on Pantheon:** `terminus secret:site:set <site>[.env] NAME value --type=env --scope=web --rebuild`.
  Changes only apply after a rebuild. Values are write-only. P1 key: `CSS_API_KEY` (drafts scope) on dev/test/local;
  `CSS_API_KEY_LIVE` (published-only) on live. A `getP1ApiKey()` resolver (fail closed on live) is planned, not built.

## Accessibility

Target is WCAG 2.2 AA. Three layers: `eslint-plugin-jsx-a11y` (recommended rules) on `design-system/`,
`components/site/` and `app/(site)/`; the Storybook a11y addon (`test: "error"`); and `e2e/a11y.spec.ts`, which runs axe
(wcag2a/2aa/21a/21aa/22aa + best-practice) on every public route at desktop and mobile sizes plus keyboard, skip-link,
focus-ring and reduced-motion checks. When adding a route, add it to the `routes` list there. Each page needs exactly one
h1; cards take `headingLevel="h2"` when they sit directly under it. Seeking uses a real `<input type="range">`.
Not covered by automation: screen-reader pass, captions (songs rely on linked lyrics as the text alternative), and the
player in its "has audio" state (CI has no bucket credentials).

## CI / deployment (mirrors jazz-nextjs)

- `test-pantheon.yml`: lint, typecheck, unit, build, accessibility (Playwright + axe), Storybook build; then waits for dev / `pr-N` and checks 200.
- `promote-pantheon.yml`: push to `test` or `live` branch tags `pantheon_test_N` / `pantheon_live_N`.
- `sync-puck-registry.yml`: needs secrets `CSS_BASE_URL`, `CSS_SITE_ID`, `CSS_REGISTRY_API_KEY`.
- `storybook-preview.yml`: per-PR preview at `https://<owner>.github.io/paris-site/pr-N/` (gh-pages; needs
  Pages enabled, which needs a public repo or paid plan).
- Repo secrets needed: `PANTHEON_MACHINE_TOKEN` (also as a Dependabot secret), plus the three above.

## Design approval workflow

Design work goes on `design-<topic>` branches into a protected `design` branch. Merging the PR is the approval.
Only approved tokens/components are applied to the site via a PR from `design` to `main`. Dark theme only;
palette is mall goth x K-pop (neon accents), no blue/gold.
The blackletter face (UnifrakturCook) is an accent for kickers only. The name PARIS is always capitals in Unbounded at -0.05em (`Wordmark` component, `--font-wordmark`), flat colour,
never the gothic font. Headings use Encode Sans Expanded 800 at about -0.04em (`--font-display`); Unbounded is reserved for the wordmark.
