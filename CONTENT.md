# Editing site content

Until content moves into P1, everything below is a file in this repo. Edit, commit, and open a PR.

| What | Where | Notes |
|---|---|---|
| Tour dates | `data/tour.json` | One object per show: `id` (used in the ticket URL), `date` (YYYY-MM-DD), `city`, `venue`, `address`, optional `capacity`, `doors`, `price`, `status` (`on-sale` or `sold-out`), `lat`, `lon`. Sorted by date automatically. |
| Albums and track lists | `data/albums.json` | Each track needs `number`, `slug` and `title`. An album with no `year` is treated as unreleased and is labelled that way. An album with an empty `tracks` list shows a "nothing here yet" message. |
| Audio | Cloudflare R2 bucket | Upload `<album-slug>/<NN>-<track-slug>.m4a`. The site lists the bucket every 5 minutes, so a new file appears without a deploy. A track with no file shows "Audio unavailable". |
| Lyrics | `content/lyrics/<slug>.md` | Frontmatter: `title`, and optionally `album` (an album slug) and `track`. Each `### Label` line starts a section. A song with no `album` is listed under "More songs". |
| Press interview | `content/press/interview.md` | Plain Markdown. |
| Merch | `data/merch.json` | `name`, `price`, `image`. |
| Bio | `app/(site)/bio/page.tsx` | Plain text in the file for now. |
| Images | `public/images/` | Reference as `/images/<file>`. |

## Adding a song

1. Add it to the album's `tracks` in `data/albums.json` (or create the album).
2. Upload the audio file using the naming above.
3. Add `content/lyrics/<slug>.md` if it has lyrics. The track slug and lyric slug must match.

Songs and lyrics are independent: lyrics with no audio, or audio with no lyrics, both work.
