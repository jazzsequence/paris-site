import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { ButtonLink } from "../../../design-system/components/Button";

export const metadata: Metadata = { title: "Bio", description: "About PARIS." };

export default function Bio() {
  return (
    <Page>
      <div className="grid items-start gap-10 md:grid-cols-[22rem_1fr]">
        <img src="/images/paris-portrait.png" alt="PARIS" className="w-full rounded-card border border-line" />
        <div className="space-y-6">
          <p className="font-gothic text-3xl text-magenta">About</p>
          <h1 className="text-chrome font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em] md:text-7xl">
            PARIS
          </h1>
          <div className="space-y-4 text-lg leading-8 text-muted">
            <p>
              PARIS makes industrial pop that sounds expensive, intentional and quietly hostile to interpretation.
              The independently released debut EP drew national press and a following that arrived faster than
              anyone expected.
            </p>
            <p>
              PARIS runs the boutique label Hostile Takeover, and Interscope Records released the full-length{" "}
              <a className="text-cyan underline underline-offset-4 hover:text-text" href="/well-enough">
                Well Enough
              </a>{" "}
              on it. <em>Tribute</em>, a collection of B-sides and unreleased songs that includes the complete EP, came
              soon after.
            </p>
            <p>
              Live, PARIS plays clubs and theatres up and down the West Coast and into the Rockies.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/tour">Tour dates</ButtonLink>
            <ButtonLink href="/press" variant="outline">Read the interview</ButtonLink>
          </div>
        </div>
      </div>
    </Page>
  );
}
