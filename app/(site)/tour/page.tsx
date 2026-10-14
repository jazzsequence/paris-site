import type { Metadata } from "next";

import { Page } from "../../../components/site/section";
import { SectionHeading } from "../../../design-system/components/SectionHeading";
import { TourDateRow } from "../../../design-system/components/TourDateRow";
import { dateParts, shows } from "../../../lib/site/tour";

export const metadata: Metadata = { title: "Tour", description: "PARIS live. Dates and tickets." };

export default function Tour() {
  return (
    <Page>
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
