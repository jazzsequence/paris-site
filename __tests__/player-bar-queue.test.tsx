import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The queue's open state is internal and there is no jsdom to click it open, so start `open` as true for the one
// useState(false) in PlayerBar. Coupled to that: if the bar gains another useState(false), narrow this.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  const useState = ((init: unknown) => {
    const [value, set] = actual.useState(init);
    return [init === false ? true : value, set];
  }) as typeof actual.useState;
  return { ...actual, default: { ...actual, useState }, useState };
});

import { PlayerBar, type PlayerBarProps } from "../design-system/components/PlayerBar";

const base: PlayerBarProps = { title: "Say when", album: "Well Enough", cover: "images/well-enough-cover.jpg", elapsed: "0:10", duration: "3:00", progress: 5 };
const queue = [
  { id: "a", title: "Say when", subtitle: "Well Enough" },
  { id: "b", title: "Second Shift", subtitle: "Well Enough" },
  { id: "c", title: "Bare" },
];
const html = (props: Partial<PlayerBarProps>) => renderToStaticMarkup(<PlayerBar {...base} queue={queue} {...props} />);
const count = (s: string, part: string) => s.split(part).length - 1;

describe("PlayerBar queue, current track", () => {
  it("says Now playing in words on the current row only", () => {
    const out = html({ currentId: "b" });
    expect(count(out, "Now playing")).toBe(1);
    expect(out).toMatch(/aria-current="true"[^]*Now playing[^]*Second Shift|aria-current="true"[^]*Second Shift[^]*Now playing/);
  });

  it("hides the label from screen readers, since aria-current already announces the row", () => {
    expect(html({ currentId: "b" })).toMatch(/<span aria-hidden="true"[^>]*>Now playing · <\/span>/);
  });

  it("keeps the magenta highlight alongside the label", () => {
    expect(html({ currentId: "b" })).toMatch(/aria-current="true"[^>]*text-magenta/);
  });

  it("still shows the subtitle next to the label", () => {
    expect(html({ currentId: "b" })).toMatch(/Now playing · <\/span>Well Enough/);
  });

  it("shows the label alone, with no stray separator, when the current track has no subtitle", () => {
    const out = html({ currentId: "c" });
    expect(out).toMatch(/<span aria-hidden="true"[^>]*>Now playing<\/span>/);
    expect(out).not.toContain("Now playing ·");
  });

  it("adds no label when nothing is current", () => {
    expect(html({})).not.toContain("Now playing");
  });
});
