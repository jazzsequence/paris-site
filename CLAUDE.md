# CLAUDE.md

PARIS artist site. Next.js 16 + P1 (Pantheon Content Publisher / Puck), deployed to Pantheon (`paris-site`),
live domain `paris.jazzsequence.com`. Primary spec: `docs/Project Outline.md`. Other files in `docs/` are
tone/context/content sources. Public copy, metadata, alt text and comments must follow the editorial rules in
that outline. `docs/` will be gitignored or moved before the repo goes public.

## Commands (pnpm; Node per `.nvmrc`)

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server (needs `.env`, see `.env.example`) |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Required before presenting changes |
| `pnpm build` | Production build; works with placeholder `NEXT_PUBLIC_CSS_SITE_ID` and `CSS_API_KEY` |
| `pnpm storybook` / `pnpm build-storybook` | Design system (`design-system/`, config in `.storybook/`) |
| `pnpm sync:registry` | Push Puck registry to P1 (CI does this) |

## Architecture decisions

- **Content split:** lyrics = Markdown in repo; bio, albums, tour dates, merch = P1; images = P1 media;
  audio = Cloudflare R2 bucket served from `music.paris.jazzsequence.com`, listed server-side at build/ISR
  from `<album-slug>/<NN>-<track-slug>.m4a`. Audio is never committed (`music/` is gitignored, and was purged
  from history before the first push).
- **Songs and lyrics are independent resources.** A track with no lyrics, or lyrics with no audio, is normal.
- **Persistent player** lives in the root layout; no cookies, no tracking, no mailing list.
- **Single Next config:** `next.config.ts` only. The starter's `.mjs` config and the Pantheon template's `.ts`
  config coexisted and Next silently loaded the `.mjs`, dropping `output: "standalone"`. Merged; do not re-add.
  `cacheHandler.mjs` must stay plain JS: the standalone server loads it at runtime.
- **`NEXT_PUBLIC_CSS_BASE_URL` is required** (`https://ccr.p1.pantheon.io`): the auth routes do not default it and 500 with "Server configuration error" if blank. (The data client does default; the broker does not.)
- **Secrets on Pantheon:** `terminus secret:site:set <site>[.env] NAME value --type=env --scope=web --rebuild`.
  Changes only apply after a rebuild. Values are write-only. P1 key: `CSS_API_KEY` (drafts scope) on dev/test/local;
  `CSS_API_KEY_LIVE` (published-only) on live. A `getP1ApiKey()` resolver (fail closed on live) is planned, not built.

## CI / deployment (mirrors jazz-nextjs)

- `test-pantheon.yml`: lint, typecheck, unit, build, Storybook build; then waits for dev / `pr-N` and checks 200.
- `promote-pantheon.yml`: push to `test` or `live` branch tags `pantheon_test_N` / `pantheon_live_N`.
- `sync-puck-registry.yml`: needs secrets `CSS_BASE_URL`, `CSS_SITE_ID`, `CSS_REGISTRY_API_KEY`.
- `storybook-preview.yml`: per-PR preview at `https://<owner>.github.io/paris-site/pr-N/` (gh-pages; needs
  Pages enabled, which needs a public repo or paid plan).
- Repo secrets needed: `PANTHEON_MACHINE_TOKEN` (also as a Dependabot secret), plus the three above.

## Design approval workflow

Design work goes on `design/<topic>` branches into a protected `design` branch. Merging the PR is the approval.
Only approved tokens/components are applied to the site via a PR from `design` to `main`. Dark theme only;
palette is mall goth x K-pop (neon accents), not Ventrue blue/gold.
The blackletter face (UnifrakturCook) is an accent for kickers only. The name PARIS is always capitals in Unbounded at -0.05em (`Wordmark` component, `--font-wordmark`), flat colour,
never the gothic font. Headings use Encode Sans Expanded 800 at about -0.04em (`--font-display`); Unbounded is reserved for the wordmark.
