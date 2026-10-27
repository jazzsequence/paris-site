import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { PlayerBar, type PlayerBarProps } from "../design-system/components/PlayerBar";

// The queue only renders once the visitor opens it, and that state is internal (no jsdom here to click it open). The
// panel's `open` is the component's only useState (initially false), so start it open. If another one is ever added this
// throws rather than silently testing the wrong thing.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useState: (initial: unknown) => {
      if (initial !== false) throw new Error("PlayerBar has a new useState: update this mock");
      return [true, () => {}];
    },
  };
});

const base: PlayerBarProps = { title: "Say when", album: "Well Enough", cover: "images/well-enough-cover.jpg", elapsed: "0:10", duration: "3:00", progress: 5 };
const queue = [
  { id: "a", title: "Say when", subtitle: "Well Enough" },
  { id: "b", title: "Second Shift", subtitle: "Well Enough" },
  { id: "c", title: "No subtitle" },
];
const html = (props: Partial<PlayerBarProps>) => renderToStaticMarkup(<PlayerBar {...base} {...props} />);
const count = (out: string, needle: string) => out.split(needle).length - 1;

describe("PlayerBar queue: the current track", () => {
  it("says Now playing in words, once, on the current row only", () => {
    const out = html({ queue, currentId: "b" });
    expect(count(out, "Now playing")).toBe(1);
    // The label sits inside the current row, not another one.
    expect(out).toMatch(/aria-current="true"[^]*?Now playing[^]*?<\/button>/);
  });

  it("hides the label from screen readers, since aria-current already says it", () => {
    expect(html({ queue, currentId: "b" })).toMatch(/<span aria-hidden="true"[^>]*>Now playing<\/span>/);
  });

  it("keeps the magenta highlight alongside the words", () => {
    expect(html({ queue, currentId: "b" })).toMatch(/aria-current="true"[^>]*text-magenta/);
  });

  it("still shows the subtitle next to the label", () => {
    expect(html({ queue, currentId: "b" })).toMatch(/Now playing<\/span><span[^>]*>Well Enough<\/span>/);
  });

  it("labels the current row even when it has no subtitle", () => {
    expect(html({ queue, currentId: "c" })).toMatch(/aria-current="true"[^]*?Now playing/);
  });

  it("says nothing when no track is current", () => {
    expect(html({ queue })).not.toContain("Now playing");
  });
});
