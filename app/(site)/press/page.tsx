import { promises as fs } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import Markdown from "react-markdown";

import { Page } from "../../../components/site/section";

export const metadata: Metadata = {
  title: "PARIS is Making Monsters Polite",
  description: "The rising industrial pop artist discusses discomfort, power, and why explanation is a form of containment.",
};

export default async function Press() {
  const md = await fs.readFile(path.join(process.cwd(), "content", "press", "interview.md"), "utf8");
  return (
    <Page narrow>
      <article
        className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-extrabold prose-headings:uppercase prose-headings:tracking-[-0.03em] prose-h2:text-4xl prose-h3:text-xl prose-h3:font-body prose-h3:normal-case prose-h3:tracking-normal prose-strong:text-text prose-a:text-cyan"
      >
        <Markdown>{md}</Markdown>
      </article>
    </Page>
  );
}
