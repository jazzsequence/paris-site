import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerBar } from "./PlayerBar";

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
export const WithQueue: Story = { args: { queue, currentId: "b" } };
