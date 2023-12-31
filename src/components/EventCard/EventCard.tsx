import React from "react";
import Link from "next/link";
import styles from "./EventCard.module.css";
import { Event } from "@/models/event.model";
import EventJSONLd from "@/components/EventJSONLd";
import { LOCALES } from "@/constants/locales.constants";
import { useAmp } from "next/amp";

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

export const performUrl = (uri: string) => process.env.NEXT_PUBLIC_URL_PREFIX + uri;
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
  const isAmp = useAmp();
  const currentLanguage = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";
  const localeDate = new Date(event.start).toLocaleDateString(
    LOCALES[currentLanguage as string]?.locale ?? currentLanguage,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <Link
      href={performUrlFromEvent(event)}
      className={styles.fullCardLink}
      title={event.title[currentLanguage]}
      passHref
      style={isAmp ? { display: "block", textDecoration: "none" } : {}}
    >
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div>
            {isAmp ? (
              <amp-img
                src={
                  event.image ??
                  (`/images/placeholder_${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}.png` as string)
                }
                alt={`${
                  event.title[currentLanguage] ?? event.name["en"]
                } ${localeDate}`}
                width="300"
                height="300"
                layout="responsive"
              />
            ) : (
              <img
                className={styles.cardImage}
                src={
                  event.image ??
                  (`/images/placeholder_${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}.png` as string)
                }
                alt={`${
                  event.title[currentLanguage] ?? event.name["en"]
                } ${localeDate}`}
              />
            )}
          </div>
          <h2 className={styles.cardTitle}>
            {event.name[currentLanguage] ?? event.name["en"]}
          </h2>
          <p className={styles.cardDescription}>
            {event.group_name?.[currentLanguage] ?? event.group_name?.["en"]}{" "}
              {event.genre} {event.sub_genre}
          </p>
          <p className={styles.cardStartDate}>
            {localeDate},{" "}
            {new Date(event.start).toLocaleTimeString(
              LOCALES[currentLanguage as string]?.locale ?? currentLanguage,
              {
                hour: "numeric",
                minute: "numeric",
              },
            )}
          </p>
          <p className={styles.cardAddress}>
            <strong>
              {event.city_name?.[currentLanguage] ?? event.provider_city_name}
            </strong>{" "}
            {event.venue ||
              event.provider_internal_venue_name ||
              event.provider_internal_venue_address}
          </p>
        </div>
        <div className={styles.cardFooter}>
          <p
            className={styles.cardPrice}
            style={
              isAmp
                ? {
                    textAlign: "center",
                    cursor: "pointer",
                    width: "100%",
                    height: "3.5rem",
                    lineHeight: "3.5rem",
                    fontSize: "2rem",
                    backgroundColor: "#006fbb",
                    color: "#fff",
                  }
                : {}
            }
          >
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
