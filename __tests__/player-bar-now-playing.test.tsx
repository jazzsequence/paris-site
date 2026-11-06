import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { PlayerBar, type PlayerBarProps } from "../design-system/components/PlayerBar";

// The queue panel only renders once the Queue button has been clicked, and that state is internal to PlayerBar. The repo has no
// jsdom to click it, so the one useState PlayerBar has (`open`, initially false) starts true here. Everything else is real.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: ((init: unknown) => (init === false ? [true, () => {}] : actual.useState(init))) as typeof actual.useState };
});

const base: PlayerBarProps = { title: "Second Shift", album: "Well Enough", cover: "images/well-enough-cover.jpg", elapsed: "0:10", duration: "3:00", progress: 5 };
const queue = [
  { id: "a", title: "Say when", subtitle: "Well Enough" },
  { id: "b", title: "Second Shift", subtitle: "Well Enough" },
  { id: "c", title: "No subtitle here" },
];
const html = (props: Partial<PlayerBarProps>) => renderToStaticMarkup(<PlayerBar {...base} queue={queue} {...props} />);
const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;

describe("PlayerBar queue: Now playing label", () => {
  it("says Now playing in words on the current row only, so colour is not the only marker", () => {
    expect(count(html({ currentId: "b" }), "Now playing")).toBe(1);
    expect(count(html({}), "Now playing")).toBe(0);
  });

  it("hides the label from screen readers; aria-current already announces the row", () => {
    const out = html({ currentId: "b" });
    expect(out).toMatch(/<span aria-hidden="true"[^>]*>Now playing · <\/span>/);
    expect(out).toContain('aria-current="true"');
  });

  it("keeps the magenta highlight on the current row", () => {
    expect(html({ currentId: "b" })).toMatch(/aria-current="true"[^>]*class="[^"]*text-magenta/);
  });

  it("sits in the subtitle line, and stands alone when the track has no subtitle", () => {
    expect(html({ currentId: "b" })).toContain("Now playing · </span>Well Enough");
    const alone = html({ currentId: "c" });
    expect(alone).toMatch(/<span aria-hidden="true"[^>]*>Now playing<\/span><\/span>/);
  });

  it("leaves other rows as they were", () => {
    const out = html({ currentId: "b" });
    expect(out).toContain('class="block truncate text-xs text-muted">Well Enough</span>');
    // Without a subtitle or the current marker, no subtitle line is rendered at all.
    expect(html({ currentId: "a" })).not.toMatch(/<span class="block truncate text-xs text-muted"><\/span>/);
  });
});
