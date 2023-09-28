import React from "react";
import { Event } from "@/models/event.model";
import { performUrlFromEvent } from "@/components/EventCard/EventCard";

const renderHTML = (rawHTML: string) =>
  React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const EventJSONLd = ({ event }: { event: Event }) => {
  const currentLanguage = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";
  const jevent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name[currentLanguage],
    startDate: event.start,
    endDate: event.end ?? new Date(event.start).setHours(23, 59, 59, 999),
    validFrom: event.validated_at ?? undefined,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: (currentLanguage === "fr" && event?.venue) ? {
        "@type": "Place",
        name: event.venue,
        address: {
            "@type": "PostalAddress",
            streetAddress: event.provider_internal_venue_address,
            addressLocality: event.provider_city_name,
            addressRegion: event.provider_internal_state_name,
        },
        url: performUrlFromEvent(event)
    } : {
      "@type": "VirtualLocation",
      url: performUrlFromEvent(event),
    },
    image:
      event.image ??
      (typeof window === "undefined"
        ? process.env.URL_PREFIX || process.env.NEXT_PUBLIC_URL_PREFIX
        : window?.location?.origin) +
        `/images/placeholder_${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}.png`,
    description: event.description?.[currentLanguage] ?? "",
    offers: {
      "@type": "Offer",
      url: performUrlFromEvent(event),
      priceCurrency: event.price_currency,
      price: event.price_min || event.price_max,
      availability: "https://schema.org/InStock",
      validFrom: event.validated_at,
      validThrough: event.end,
    },
  };
  return renderHTML(
    `<script type='application/ld+json'>${JSON.stringify(jevent)}</script>`,
  );
};

export default EventJSONLd;
