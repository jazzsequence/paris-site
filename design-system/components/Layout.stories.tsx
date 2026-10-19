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
/**
 * The photo is a portrait cropped into a landscape frame, so the face lands in a different place at every width.
 * Review the hero at each of these before approving a change to it: the text card must not cover the face.
 */
const heroAt = (width: number, height: number): StoryObj => ({
  parameters: { viewport: { options: { review: { name: `${width}x${height}`, styles: { width: `${width}px`, height: `${height}px` } } } } },
  globals: { viewport: { value: "review", isRotated: false } },
  render: HeroSection.render,
});
export const HeroPhone: StoryObj = heroAt(390, 844);
export const HeroTablet: StoryObj = heroAt(768, 1024);
export const HeroSmallLaptop: StoryObj = heroAt(1024, 768);
export const HeroLaptop: StoryObj = heroAt(1280, 800);
export const HeroDesktop: StoryObj = heroAt(1440, 900);
export const HeroWide: StoryObj = heroAt(1920, 1080);
export const Footer: StoryObj = { render: () => <SiteFooter /> };
