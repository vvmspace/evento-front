import React from "react";
import { Event } from "@/models/event.model";
import {performUrl, performUrlFromEvent} from "@/components/EventCard/EventCard";
import { t } from "@/libs/t";

const renderHTML = (rawHTML: string) =>
  React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const EventJSONLd = ({ event }: { event: Event }) => {
  const currentLanguage = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";
  const jevent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name[currentLanguage],
    startDate: event.start,
    // ISO string for endDate: end or start + 2 hours ISO string
    endDate:
      event.end ??
      new Date(
        new Date(event.start).getTime() + 24 * 3600 * 1000,
      ).toISOString(),
    validFrom: event.validated_at ?? event.updatedAt ?? undefined,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location:
      currentLanguage === "fr" && event?.venue
        ? {
            "@type": "Place",
            name: event.venue,
            address: {
              "@type": "PostalAddress",
              streetAddress: event.provider_internal_venue_address,
              addressLocality: event.provider_city_name,
              addressRegion: event.provider_internal_state_name,
            },
            url: performUrlFromEvent(event),
          }
        : {
            "@type": "VirtualLocation",
            url: performUrlFromEvent(event),
          },
    image:
      event.image ??
      (typeof window === "undefined"
        ? process.env.URL_PREFIX || process.env.NEXT_PUBLIC_URL_PREFIX
        : window?.location?.origin) +
        `/images/placeholder_${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}.png`,
    description:
      event.description?.[currentLanguage] ??
      event.call_for_action?.[currentLanguage] ??
      `${event.name[currentLanguage]} ${new Date(
        event.start,
      ).getFullYear()} ${t("tickets")})}`,
    offers: {
      "@type": "Offer",
      url: performUrlFromEvent(event),
      priceCurrency: event.price_currency,
      price: event.price_min || event.price_max,
      availability: "https://schema.org/InStock",
      validFrom: event.validated_at,
      validThrough: event.start,
    },
    performer: {
      "@type": "PerformingGroup",
      name: event.provider_id,
      sameAs: event.provider_id,
    },
    organizer: {
      "@type": "Organization",
      name: event.provider_id,
      sameAs: event.provider_id,
      url: performUrl("/" + event.provider_id)
    },
  };
  return renderHTML(
    `<script type='application/ld+json'>${JSON.stringify(jevent)}</script>`,
  );
};

export default EventJSONLd;
