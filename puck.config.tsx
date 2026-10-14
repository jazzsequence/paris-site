import type { Config } from "@puckeditor/core";

import { buttonBlock } from "./components/puck/button-block";
import { dividerBlock } from "./components/puck/divider-block";
import { headingBlock } from "./components/puck/heading-block";
import { imageBlock } from "./components/puck/image-block";
import { gridBlock } from "./components/puck/grid-block";
import { mediaFigureBlock } from "./components/puck/media-figure-block";
import { paragraphBlock } from "./components/puck/paragraph-block";
import { quoteBlock } from "./components/puck/quote-block";
import { puckRoot } from "./components/puck/root";
import { spacerBlock } from "./components/puck/spacer-block";
import { welcomeBlock } from "./components/puck/welcome-block";
import { dataListBlock } from "./components/puck/data-list-block";
import { p1Blocks, p1Categories } from "./components/puck/blocks";
import { imageTextBlock } from "./components/puck/paris/image-text-block";
import { merchGridBlock } from "./components/puck/paris/merch-grid-block";
import { pageHeadingBlock } from "./components/puck/paris/page-heading-block";
import { tourDatesBlock } from "./components/puck/paris/tour-dates-block";

export const config = {
  categories: {
    ...p1Categories,
    paris: {
      title: "PARIS",
      components: ["PageHeadingBlock", "ImageTextBlock", "TourDatesBlock", "MerchGridBlock"],
    },
    data: {
      title: "Data",
      components: ["DataListBlock"],
    },
    pages: {
      title: "Page Sections",
      components: ["P1WelcomeBlock"],
    },
    // Replaced by the P1 component library. Still registered so existing pages
    // render, but hidden so new pages use the library versions.
    deprecated: {
      title: "Deprecated",
      components: [
        "HeadingBlock",
        "ParagraphBlock",
        "QuoteBlock",
        "ImageBlock",
        "MediaFigureBlock",
        "GridBlock",
        "DividerBlock",
        "SpacerBlock",
        "ButtonBlock",
      ],
      visible: false,
    },
  },
  root: puckRoot,
  components: {
    ...p1Blocks,
    PageHeadingBlock: pageHeadingBlock,
    ImageTextBlock: imageTextBlock,
    TourDatesBlock: tourDatesBlock,
    MerchGridBlock: merchGridBlock,
    HeadingBlock: headingBlock,
    ParagraphBlock: paragraphBlock,
    ImageBlock: imageBlock,
    MediaFigureBlock: mediaFigureBlock,
    GridBlock: gridBlock,
    QuoteBlock: quoteBlock,
    DividerBlock: dividerBlock,
    SpacerBlock: spacerBlock,
    ButtonBlock: buttonBlock,
    DataListBlock: dataListBlock,
    P1WelcomeBlock: welcomeBlock,
  },
} as Config;

export default config;
