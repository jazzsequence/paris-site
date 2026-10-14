import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Hero } from "./Hero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const meta = { title: "Layout/Header, hero, footer", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

export const Header: StoryObj = { render: () => <SiteHeader current="/tour" /> };
export const HeroSection: StoryObj = {
  render: () => (
    <Hero
      image="images/paris-on-stage.jpg"
      kicker="New album"
      title="Well Enough"
      blurb="The new album, out now on Hostile Takeover."
    />
  ),
};
export const Footer: StoryObj = { render: () => <SiteFooter /> };
