import React from "react";
import { Event } from "@/models/event.model";
import { performUrlFromEvent } from "@/components/EventCard/EventCard";

const renderHTML = (rawHTML: string) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const EventJSONLd =  ({event}: {event: Event}) => {
    const currentLanguage = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";
    const jevent = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.name[currentLanguage],
        startDate: event.start,
        endDate: event.end,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
            "@type": "VirtualLocation",
            url: performUrlFromEvent(event),
        },
        image: event.image,
        description: event.description[currentLanguage],
        offers: {
            "@type": "Offer",
            url: performUrlFromEvent(event),
            priceCurrency: event.price_currency,
            price: event.price_min || event.price_max,
            availability: "https://schema.org/InStock",
            validFrom: event.validated_at,
            validThrough: event.end,
        }
    }
    return (renderHTML(`<script type='application/ld+json'>${JSON.stringify(jevent)}</script>`));
}

export default EventJSONLd;