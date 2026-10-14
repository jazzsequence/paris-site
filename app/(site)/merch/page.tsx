import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { MerchCard } from "../../../design-system/components/MerchCard";
import { SectionHeading } from "../../../design-system/components/SectionHeading";
import merch from "../../../data/merch.json";

export const metadata: Metadata = { title: "Merch", description: "PARIS merchandise, available at shows." };

export default function Merch() {
  return (
    <Page>
      <SectionHeading kicker="Take something home">Merch</SectionHeading>
      <p className="max-w-xl text-muted">Everything here is sold at the merch table on tour. Online orders are not open yet.</p>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {merch.map((m) => (
          <MerchCard key={m.slug} name={m.name} price={m.price} image={m.image} />
        ))}
      </div>
    </Page>
  );
}
