import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerBar, type RepeatMode } from "./PlayerBar";

const meta = {
  title: "Components/PlayerBar",
  component: PlayerBar,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Consent of the Quiet",
    album: "Well Enough",
    cover: "images/well-enough-cover.jpg",
    elapsed: "1:12",
    duration: "3:58",
    progress: 30,
    playing: true,
  },
} satisfies Meta<typeof PlayerBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playing: Story = {};
export const Paused: Story = { args: { playing: false } };

const queue = [
  { id: "a", title: "Say when", subtitle: "Well Enough" },
  { id: "b", title: "Second Shift", subtitle: "Well Enough" },
  { id: "c", title: "Don’t ask what I am", subtitle: "Well Enough" },
];
export const WithQueue: Story = { args: { queue, currentId: "b", onRemove: () => {}, onClear: () => {} } };

// The controls only show when their handler is given, so the player bar keeps its current look wherever repeat and shuffle are not wired up.
export const ShuffleOn: Story = { args: { queue, currentId: "b", shuffle: true, onShuffle: () => {}, repeat: "off", onRepeat: () => {} } };
export const RepeatAll: Story = { args: { queue, currentId: "b", shuffle: false, onShuffle: () => {}, repeat: "all", onRepeat: () => {} } };
export const RepeatOne: Story = { args: { queue, currentId: "b", shuffle: false, onShuffle: () => {}, repeat: "one", onRepeat: () => {} } };

const NEXT: Record<RepeatMode, RepeatMode> = { off: "all", all: "one", one: "off" };

function InteractivePlayer(args: React.ComponentProps<typeof PlayerBar>) {
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  return <PlayerBar {...args} queue={queue} currentId="b" shuffle={shuffle} onShuffle={() => setShuffle((s) => !s)} repeat={repeat} onRepeat={() => setRepeat((r) => NEXT[r])} />;
}

/** Click the two buttons: shuffle toggles, repeat cycles off, all, this track. */
export const Interactive: Story = { render: (args) => <InteractivePlayer {...args} /> };
