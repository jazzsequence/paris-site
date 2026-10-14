import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { SectionHeading } from "../../../design-system/components/SectionHeading";
import { TourDateRow } from "../../../design-system/components/TourDateRow";
import { dateParts, shows } from "../../../lib/site/tour";
import { pageMetadata } from "../../../lib/site/seo";
import { JsonLd } from "../../../components/site/json-ld";
import { eventData } from "../../../lib/site/structured-data";

export const metadata: Metadata = pageMetadata({ title: "Tour", description: "PARIS live: tour dates, venues and tickets.", path: "/tour" });

export default function Tour() {
  return (
    <Page>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": shows.map(eventData) }} />
      <SectionHeading as="h1" kicker="Live">Tour dates</SectionHeading>
      <ul>
        {shows.map((s) => (
          <TourDateRow
            key={s.id}
            {...dateParts(s.date)}
            city={s.city}
            venue={s.venue}
            capacity={s.capacity}
            status={s.status}
            href={`/tickets/${s.id}`}
            headingLevel="h2"
          />
        ))}
      </ul>
    </Page>
  );
}
