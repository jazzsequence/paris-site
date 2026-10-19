# CLAUDE.md

PARIS artist site. Next.js 16 + P1 (Puck), deployed to Pantheon (`paris-site`),
live domain `paris.jazzsequence.com`. Primary spec: `docs/Project Outline.md` (kept locally, not tracked). Public copy, metadata, alt text,
code comments and docs must never state or hint at anything the outline marks as off-limits. Keep backstory out
of everything committed.

## Commit review (reviewer agent)

Installed from https://github.com/jazzsequence/claude-code-reviewer. Every commit of AI-written code needs an
approval from the `reviewer` subagent first; a PreToolUse hook (`.claude/helpers/hook-handler.cjs`) and a git
pre-commit hook (`.githooks/pre-commit`, config in `.reviewer-config.sh`) block the commit otherwise.

1. Stage the change (`git add`), then spawn the reviewer: `Agent({ subagent_type: "reviewer", prompt: "<what changed and why>" })`.
2. Describe the change factually. Never tell the reviewer to approve, and never write `reviewer-approved` myself.
3. On APPROVE, commit within 5 minutes and without touching the index again (the approval is bound to the staged content).
   On REJECT, fix and request a fresh review.
4. `USER_COMMIT=1` is for commits the owner writes by hand. Claude never uses it; if the reviewer is unavailable or blocks
   something wrong, stop and ask the owner.

How this fits the rest of this file:
- The reviewer is the commit gate. It does not replace the PR, the Storybook approval for `design-system/` (see below),
  or CI. Open PRs from feature branches off `origin/main`; the owner merges.
- Per commit the hook runs `pnpm test`, `pnpm lint && pnpm typecheck` and `pnpm build` (`.reviewer-config.sh`; the generated defaults were npm
  and would have failed). Docs-only commits (`.md`, `.mdx`, `.txt`, `.rst`) and commits touching only `.claude/` or `.githooks/` skip all of
  that (`REVIEWER_TEXT_ONLY_PATTERN`, and the reviewer's own skip rule matches); they still need the reviewer's checklist. e2e is not in
  the hook (needs a fresh build and port 3100; CI runs it on every PR): run `pnpm test:e2e` myself before opening a PR, and the reviewer
  runs it too when `e2e/`, `app/` routes or `design-system/` change.
- Reviewer files are committed: `.claude/agents/reviewer.md`, `.claude/helpers/hook-handler.cjs`, `.claude/settings.json`,
  `.githooks/`, `.reviewer-config.sh`, and the checklist at `.claude/REVIEWER_CHECKLIST.md` (moved out of the gitignored `docs/`).
  The checklist's "Project-specific checks" section holds this repo's rules: the editorial rule, the design-system gate (story at the
  relevant sizes, flagged for the owner's Storybook approval), docs/a11y, and P1 content and key rules. Edit it when a rule changes.
  Re-running the upstream `install.sh` will not overwrite the config or checklist, but will flag `reviewer.md` as locally modified (path edit).
- Commit trailer stays `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (the reviewer checks for a co-author line).
- The hooks cap AI commits at 5 files and 500 inserted lines (lock files excluded), so split work into small logical commits within a PR.
  Merge commits are exempt. Anything inherently larger is the owner's to commit with `USER_COMMIT=1`; ask rather than work around it.
- `docs/` is gitignored here (local spec and character files). Do not put anything that must be committed in it, and do not
  switch branches carelessly: `docs/` and `images/` were once tracked on the old `design` branch, and moving between that
  branch and `main` deleted them twice. A backup lives in `~/paris-site-local-backup/`.

## Commands (pnpm; Node per `.nvmrc`)

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server (needs `.env`, see `.env.example`) |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Required before presenting changes |
| `pnpm build` | Production build; works with placeholder `NEXT_PUBLIC_CSS_SITE_ID` and `CSS_API_KEY` |
| `pnpm test:e2e` (alias `test:a11y`; `P1_LIVE=1` runs against live P1 content using the credentials in `.env`, default is repo-copy only) | Playwright: axe, keyboard, navigation and favicon checks against the standalone build (run `pnpm build` first; kill any stale server on :3100). Build and run with CI's placeholders and an unroutable base URL: `CSS_API_KEY=ci-placeholder CSS_API_KEY_LIVE= NEXT_PUBLIC_CSS_SITE_ID=00000000-0000-0000-0000-000000000000 NEXT_PUBLIC_CSS_BASE_URL=http://127.0.0.1:9 pnpm build`, then the same variables with `pnpm test:e2e` (see `test-pantheon.yml`). Never point a placeholder run at `ccr.p1.pantheon.io` (see "No P1 traffic from placeholders" under Architecture). A build that loads the real credentials from `.env` prerenders the published P1 pages, so the e2e run then tests those instead of the repo copies (seen on `/albums/ep`: album pages are prerendered at build and served until `revalidate = 300`) |
| `pnpm storybook` / `pnpm build-storybook` | Design system (`design-system/`, config in `.storybook/`) |
| `pnpm sync:registry` | Push Puck registry to P1 (CI does this) |

## Architecture decisions

- **Content split:** lyrics = Markdown in repo; bio, albums, tour dates, merch = P1; images = P1 media;
  audio = Cloudflare R2 bucket served from `music.paris.jazzsequence.com`, listed server-side at build/ISR
  from `<album-slug>/<NN>-<track-slug>.m4a`. Audio is never committed (`music/` is gitignored, and was purged
  from history before the first push).
- **P1 pages (all of them except per-song lyrics, tickets and error pages, by decision):** `/`, `/tour`, `/bio`, `/merch`, `/listen`, `/albums`, `/albums/<slug>`, `/well-enough`, `/lyrics`, `/press`, `/privacy` render the published P1 page (`loadPublishedPage` via
  `lib/site/p1-content.ts`) and fall back to the repo copy when P1 is missing or unreachable, so CI (placeholder creds) and
  outages keep working. P1 pages use the PARIS blocks in `components/puck/paris/` (`PageHeadingBlock`, `ImageTextBlock`,
  `TourDatesBlock`, `MerchGridBlock`, plus `HeroBlock`, `ArticleBlock`, `AlbumHeaderBlock`, `TrackListBlock`, ... in `content-blocks.tsx` and
  `catalog-blocks.tsx`); ticket pages, sitemap and JSON-LD read shows from the `TourDatesBlock`. Catalog blocks get their data from
  `SiteDataProvider` (server-loaded on public pages via `P1Page`, fetched from `/api/site-data` in the editor canvas), so credentials never
  reach the browser. The starter's own "Welcome" document at `/` is ignored (`isStarterPage`). Page definitions live in
  `content/p1-pages/*.json`; CI renders them through a test-only `/e2e-fixtures/<name>` route (only when `E2E_FIXTURES=1`) and checks they
  say the same as the code versions, have one h1, pass axe and load every image. Every design-system component must be mapped to a block or
  an exclusion reason in `__tests__/design-system-coverage.test.ts`. P1 has no
  templates/datasources here and the MCP cannot create them, so structured data lives in block array fields. Registry
  sync: `pnpm sync:registry` (CI) or the P1 MCP `sync_components`; `fast-json-patch` is patched (`patches/`) because tsx
  otherwise loads its unshipped `index.ts`. Do NOT create P1 workstreams alongside code PRs (decided with the owner: two histories, ordering bugs, merged-workstream reuse). Code merges and deploys first; pages are then created directly in P1 by the owner's instruction. Never publish or edit live P1 content unprompted.
- **How P1 content reaches live:** there is one P1 site and every Pantheon environment reads it; only the API key differs (drafts key off live, published-only
  key on live). So content does not move between environments: **publishing a page in P1 is the go-live step** (a page saved on `main` but not published is
  invisible to both keys; `publish_page` copies it live). Code moves dev -> test -> live through the Pantheon promotion workflow. To preview a content change
  without publishing, use a P1 workstream (that is what workstreams are for; the "no workstreams" rule above is only about pairing them with code PRs).
  State as of 2026-10-19, everything below is published in P1. `/`, `/albums`, `/albums/{ep,tribute,unreleased}`, `/listen`, `/lyrics`, `/press`, `/privacy` and
  `/well-enough` were created from `content/p1-pages/*.json`, which is also their fallback copy, so those files do not follow later edits made in P1.
  `/bio`, `/tour` and `/merch` were published earlier, from a workstream that has since been merged; they have no `content/p1-pages` file, and their fallbacks are the
  code version in `app/(site)/bio/`, `data/tour.json` and `data/merch.json`.
- **Where the rest of the content lives:** the public pages are code under `app/(site)/` with content in the repo:
  `data/albums.json` (albums, tracks, an optional `gallery` of extra art per album, `unreleased` pseudo-album with no `year`), `data/tour.json` and `data/merch.json` (fallbacks),
  `content/lyrics/*.md` (frontmatter `title`/`album`/`track`, `### Label` sections), `content/press/interview.md`.
  To add a song: add it to
  `data/albums.json`, upload `<album>/<NN>-<slug>.m4a` to the bucket, add `content/lyrics/<slug>.md` if it has lyrics.
  P1 pages render inside the `(site)` layout (the catch-all lives under it).
- **Tour dates are fictional; venues are real 1997 clubs and theatres, so check each against a source before adding one.** The ticket flow
  (`/tickets/[id]` -> `/ticket?...`) keeps all state in the URL and collects nothing.
- **Songs and lyrics are independent resources.** A track with no lyrics, or lyrics with no audio, is normal.
- **Persistent player** lives in the site layout; no cookies, no tracking, no mailing list. The `<audio>` element must
  NOT have `crossOrigin`: with it, every new preview/prod origin has to be added to the bucket's CORS list or playback
  silently fails (downloads still work because they go through `/api/download`). Without it playback needs no CORS.
- **Unreleased** means no public release (not "coming soon"). It is an album-style page with no `year`; do not seed it with
  songs that merely lack audio. The EP has its own album page (`ep`) with real cover art, plus a back cover and inner spread shown as a gallery under the track list. Unreleased still uses the `paris-close.jpg` placeholder until it has art.
- Content editing guide for humans: `CONTENT.md`.
- **`serverExternalPackages: ["yjs"]`** in `next.config.ts` stops the "Yjs was already imported" warning (yjs loaded twice, ESM and CJS). The starter's `webpack` yjs alias is ignored by Turbopack, the default builder.
- **Single Next config:** `next.config.ts` only. The starter's `.mjs` config and the Pantheon template's `.ts`
  config coexisted and Next silently loaded the `.mjs`, dropping `output: "standalone"`. Merged; do not re-add.
  `cacheHandler.mjs` must stay plain JS: the standalone server loads it at runtime.
  `start` must be `node .next/standalone/server.js` (with `copy-standalone` in `build`), never `next start`: that
  ignores `output: standalone` and looks for `cacheHandler.mjs` inside `.next/`, so every request 500s on Pantheon.
- **`NEXT_PUBLIC_CSS_BASE_URL` is required** (`https://ccr.p1.pantheon.io`): the auth routes do not default it and 500 with "Server configuration error" if blank. (The data client does default; the broker does not.)
- **Secrets on Pantheon:** `terminus secret:site:set <site>[.env] NAME value --type=env --scope=web --rebuild`.
  Changes only apply after a rebuild. Values are write-only. P1 key: `CSS_API_KEY` (drafts scope) on dev/test/local;
  `CSS_API_KEY_LIVE` (published-only) on live. `getP1ApiKey()` (`lib/site/p1-key.ts`) picks the key by `PANTHEON_ENVIRONMENT` and throws on live without the live key; `instrumentation.ts` copies it into `CSS_API_KEY` at start because the SDK's published-page reads use that variable directly. Live with no `CSS_API_KEY_LIVE` returns 500 on purpose (verified), never the drafts key. Next loads `.env` itself, so test this with `CSS_API_KEY_LIVE=` (empty), not unset.
- **No P1 traffic from placeholders.** CI, the e2e run and local checks use placeholder credentials (a key containing "placeholder", an all-zeros or missing site id) so
  they render the repo copies. They must never send P1 a request: earlier they did, against the live backend, and every one was refused (measured with a local
  listener standing in for P1: 26 requests per build and about 2 per page load, so thousands per e2e run). `isP1Configured()` in `lib/site/p1-config.ts` is false for
  those credentials; `getP1Page` then returns null without calling the SDK, and `next.config.ts` sets the build-time `NEXT_PUBLIC_CSS_BASE_URL` to the unroutable
  `http://127.0.0.1:9`, which also stops the SDK's own catch-all route (that route must stay an untouched shim; `published-page-routes.test.ts` pins it). CI's build and
  e2e steps use the same unroutable URL. After the change a build, the whole e2e run and 14 page loads sent the listener 0 requests. In placeholder mode an unknown path
  returns a 500 (the SDK's fetch to the unroutable address fails) where P1's 400 used to be handled; nothing tests it. The key is judged by `getP1ApiKey()`, so on live it is
  `CSS_API_KEY_LIVE`; the check runs at build time, and on Pantheon the live key is a secret that only applies after a rebuild, so build and runtime agree. To check for stray
  requests, point `NEXT_PUBLIC_CSS_BASE_URL` at a local HTTP listener and count what it receives.

## Accessibility

Target is WCAG 2.2 AA. Three layers: `eslint-plugin-jsx-a11y` (recommended rules) on `design-system/`,
`components/site/` and `app/(site)/`; the Storybook a11y addon (`test: "error"`); and `e2e/a11y.spec.ts`, which runs axe
(wcag2a/2aa/21a/21aa/22aa + best-practice) on every public route at desktop and mobile sizes plus keyboard, skip-link,
focus-ring and reduced-motion checks. When adding a route, add it to the `routes` list there. The 404 page goes through P1, so it is only checked with
`A11Y_P1_ROUTES=1` and real credentials in `.env`. Each page needs exactly one
h1; cards take `headingLevel="h2"` when they sit directly under it. Seeking uses a real `<input type="range">`.
Not covered by automation: screen-reader pass, captions (songs rely on linked lyrics as the text alternative), and the
player in its "has audio" state (CI has no bucket credentials).

## Standards

Follows https://specification.website where it applies: canonical + Open Graph via `pageMetadata`, JSON-LD, robots/sitemap/manifest,
security headers + CSP in `next.config.ts` (production only; `/p1` exempt), privacy page, custom 404/500, `lang` on Korean titles,
optimised images. Deliberately not done: AI-crawler rules in robots.txt and Content-Signal (owner's call), hreflang (one language),
cookie consent and GPC (no cookies or data processing), RSS (no feed content yet). standard.site support is verification plumbing
driven by `data/standard-site.json`; the records themselves are created by `scripts/publish-standard-site.mjs` with the owner's
account, which Claude must not run without being given credentials. `security.txt` needs `SECURITY_CONTACT`.

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
