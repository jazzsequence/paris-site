import Markdown from "react-markdown";

import { ButtonLink } from "../../../design-system/components/Button";

type Props = {
  imageUrl?: string;
  imageAlt?: string;
  imageSide?: "left" | "right";
  kicker?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/** A photo beside a block of text. Use it for the bio. Body accepts Markdown. */
export const imageTextBlock = {
  label: "Image and text",
  fields: {
    imageUrl: { type: "text" as const, label: "Image URL" },
    imageAlt: { type: "text" as const, label: "Image description (for screen readers)" },
    imageSide: {
      type: "radio" as const,
      label: "Image position",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    kicker: { type: "text" as const, label: "Small label above the title" },
    title: { type: "text" as const, label: "Title" },
    body: { type: "textarea" as const, label: "Text (Markdown)" },
    ctaLabel: { type: "text" as const, label: "Button label (optional)" },
    ctaHref: { type: "text" as const, label: "Button link" },
  },
  defaultProps: { imageUrl: "", imageAlt: "", imageSide: "left" as const, kicker: "", title: "", body: "", ctaLabel: "", ctaHref: "" },
  render: ({ imageUrl, imageAlt, imageSide, kicker, title, body, ctaLabel, ctaHref }: Props) => (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className={`grid items-start gap-10 ${imageUrl ? "md:grid-cols-[22rem_1fr]" : ""}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || ""}
            loading="lazy"
            decoding="async"
            className={`w-full rounded-card border border-line ${imageSide === "right" ? "md:order-2" : ""}`}
          />
        ) : null}
        <div className="space-y-5">
          {kicker ? <p className="font-gothic text-3xl text-magenta">{kicker}</p> : null}
          {title ? (
            <h2 className="text-chrome font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">
              {title}
            </h2>
          ) : null}
          {body ? (
            <div className="space-y-4 text-lg leading-8 text-muted [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-4">
              <Markdown>{body}</Markdown>
            </div>
          ) : null}
          {ctaLabel && ctaHref ? <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink> : null}
        </div>
      </div>
    </div>
  ),
};
