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
