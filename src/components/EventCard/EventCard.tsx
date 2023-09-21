import React from "react";
import Link from "next/link";
import styles from "./EventCard.module.css";
import {Event} from "@/models/event.model";
import EventJSONLd from "@/components/EventJSONLd";

type EventCardProps = {
  event: Event;
};

export const performGroupAliasFromEvent = (event: Event): string => {
  return (
      event.group_alias ||
      event.provider_internal_country_name ||
      event.provider_internal_state_name ||
      event.sub_genre ||
      event.genre ||
      event.provider_city_name ||
      event.provider_internal_venue_name ||
      event.provider_internal_country_code ||
      "event"
  )
      .toLowerCase()
      .replaceAll(" ", "%20")
      .replaceAll("&", "%26");
};
export const performUrlFromEvent = (event: Event) => {
  return (
    (typeof window === "undefined"
      ? process.env.URL_PREFIX || process.env.NEXT_PUBLIC_URL_PREFIX
      : window?.location?.origin) +
    "/" +
    `${performGroupAliasFromEvent(event)}/${event.alias}`
  );
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const currentLanguage = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";

  return (
    <Link
      href={performUrlFromEvent(event)}
      className={styles.fullCardLink}
      title={event.title[currentLanguage]}
      passHref
    >
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div>
            <img
              className={styles.cardImage}
              src={event.image as string}
              alt={event.title[currentLanguage] ?? event.name["en"]}
            />
          </div>
          <h2 className={styles.cardTitle}>
            {event.name[currentLanguage] ?? event.name["en"]}
          </h2>
          <p className={styles.cardStartDate}>
            {new Date(event.start).toLocaleDateString(currentLanguage, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            ,{" "}
            {new Date(event.start).toLocaleTimeString(currentLanguage, {
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          <p className={styles.cardAddress}>
            <strong>{event.provider_city_name}</strong>{" "}
            {event.venue ||
              event.provider_internal_venue_name ||
              event.provider_internal_venue_address}
          </p>
        </div>
        <div className={styles.cardFooter}>
          <p className={styles.cardPrice}>
            {(event.price_min &&
              event.price_min !== event.price_max &&
              `${event.price_min} - `) ||
              ""}
            {event.price_max} {event.price_currency}
          </p>
        </div>
        <EventJSONLd event={event} />
      </div>
    </Link>
  );
};

export default EventCard;
