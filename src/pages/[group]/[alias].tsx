import { FC } from "react";
import { Event } from "@/models/event.model";
import { fetch } from "next/dist/compiled/@edge-runtime/primitives";
import Head from "next/head";
import EventCard, {
  performGroupAliasFromEvent,
} from "@/components/EventCard/EventCard";
import styles from "../../styles/EventPage.module.css";
import globalStyles from "../../styles/Global.module.css";
import { t } from "@/libs/t";
import EventJSONLd from "@/components/EventJSONLd";
import Link from "next/link";
const { event: gEvent } = require("nextjs-google-analytics");

type EventPageProps = {
  event: Event;
  related: Event[];
  alias: string;
  group: string;
  cityName: string;
    groupName: string;
};

const cachedRelated: {
  [key: string]: Event[];
} = {};

const getRelated = async (group: string) => {
  if (cachedRelated[group]) {
    return cachedRelated[group];
  }
  const everywhere_url = `${process.env.API_PREFIX}/events?use_cache=true&active=true&ssr=true&select=group_alias,provider_city_name,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=4&everywhere=${group}&sort=start_asc&start_from=${
    new Date().toISOString().split("T")[0]
  }&locale=${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}`;
  const group_response = await fetch(everywhere_url);
  console.log("everywhere_url", everywhere_url);
  const related: Event[] = await group_response.json();
  cachedRelated[group] = related;
  return related;
};

const cachedEvents: Record<string, Partial<Event>> = {};

const getEvent = async (alias: string) => {
  if (cachedEvents[alias]) {
    return cachedEvents[alias];
  }
  const response = await fetch(
    `${process.env.API_PREFIX}/events?use_cache=true&select=city_name,provider_internal_venue_name,group_name,updatedAt,image,description,name,alias,start,provider_city_name,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency,link&ssr=true&alias=${alias}&locale=${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}`,
  );
  const fetchedEvent = (await response.json())[0];
  cachedEvents[alias] = fetchedEvent;
  return fetchedEvent;
};

const EventPage: FC<EventPageProps> = ({ event, related, group, alias, groupName }) => {
  const language = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";

  const affiliateLink = (event: Event): string => event.link;

  const ABCD: Record<string, () => Record<string, string | number | boolean | Record<string, any> | undefined>> = {
    "en": () => ({
      "action": "click",
      "actionCategory": "click",
      "action2": "click",
      "category": group,
      "label": event.name[language],
      "value": event.price_min,
    }),
    "es": () => ({
        "action": "event_click",
        "actionCategory": "click",
        "action2": "event_click",
        "category": group,
        "label": event.name[language],
        "value": event.price_min,
    }),
    "fr": () => ({
        "action": "click",
        "actionCategory": "click",
        "action2": "event_click",
        "category": group,
        "label": event.name[language],
        "value": event.price_min,
      ...event
    }),
    "am": () => ({
        "action": "event_click",
        "actionCategory": "click",
        "action2": "click",
        "category": group,
        "label": event.name[language],
        "value": event.price_min,
        ...event
    })
  }

  const handleAffiliateClick = () => {
    gEvent(ABCD[language]().action, {
        action: ABCD[language]().action2,
        actionCategory: ABCD[language]().actionCategory,
        category: ABCD[language]().category,
        label: ABCD[language]().label,
        value: ABCD[language]().value,
    });
    gEvent("purchase", {
        action: "purchase",
        actionCategory: "purchase",
        category: ABCD[language]().category,
      value: ABCD[language]().value,
      currency: event.price_currency,
    })
    const link = affiliateLink(event);
    if (link) {
      window.open(link, "_blank");
    }
  };

  if (!event && alias?.includes("20")) {
    const fake_title = alias
      ? alias
          .split("")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") +
        " " +
        group
      : "";
    return (
      <div className={styles.eventWrapper}>
        <Head>
          <title>{fake_title}</title>
        </Head>
        <h1>
          {fake_title} {group}
        </h1>
        <div>
          <p>{t("Event is expired or will be available later")}</p>
        </div>
        )
      </div>
    );
  }

  return event ? (
    <div className={styles.eventWrapper}>
      <Head>
        <title>
          {event.title[language]} |{" "}
          {event.city_name?.[language] ?? event.provider_city_name ? `${t(event.provider_city_name as string)} | ` : ""}
          {event?.call_for_action?.[language] ?? ""}
        </title>
        <meta name="description" content={event.description[language] ?? ""} />
        <meta property="og:title" content={event.title[language]} />
        <meta
          property="og:description"
          content={event.call_for_action?.[language] ?? ""}
        />
        <meta property="og:image" content={event.image} />
      </Head>
      <h1 className={styles.eventTitle}>{event.name[language]}</h1>
      <div className={styles.eventContent}>
        <EventJSONLd event={event} />
        <div className={styles.card}>
          <div className={styles.image}>
            <img
              src={
                event.image ??
                `/images/placeholder_${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}.png`
              }
              alt={event.name[language]}
            />
          </div>
          <div className={styles.description}>
            {event.description[language]
              ?.split("\n\n")
              .map((paragraph, key) => (
                <p key={key} className={styles.paragraph}>
                  {paragraph.split("\n").map((line) => (
                    <>
                      {line}
                      <br />
                    </>
                  ))}
                </p>
              ))}
            <div>
              <Link className={globalStyles.tag} href={`/${group}`}>
                {event?.group_name?.[language] ?? group}
              </Link>
              {event.provider_city_name ? (
                <>
                  {" "}
                  <Link
                    className={globalStyles.tag}
                    href={`/${event.provider_city_name?.toLowerCase()}`}
                  >
                    {event.provider_city_name}
                  </Link>
                </>
              ) : (
                ""
              )}
              {event.provider_internal_country_name ? (
                <>
                  {" "}
                  <Link
                    className={globalStyles.tag}
                    href={`/${event.provider_internal_country_name?.toLowerCase()}`}
                  >
                    {event.provider_internal_country_name}
                  </Link>
                </>
              ) : (
                ""
              )}
            </div>
            {event.start && (
              <>
                <h2 className={styles.subTitle}>{t("When?")}</h2>
                <p className={styles.date}>
                  {t("Date")}: {new Date(event.start).toLocaleDateString(language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                </p>
                <p className={styles.date}>
                  {t("Start")}:{" "}
                  {new Date(event.start).toLocaleTimeString(language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </>
            )}
            {(event.provider_internal_venue_address ||
              event.provider_city_name ||
              event.venue) && (
              <>
                <h2 className={styles.subTitle}>{t("Where?")}</h2>
                <p className={styles.address}>
                  {event.provider_internal_venue_address
                    ? event.provider_internal_venue_address + ", "
                    : ""}
                  <strong>{event.city_name?.[language] ?? event.provider_city_name
                    ? event.provider_city_name
                      : ""}</strong>{" "}
                  {event.venue || event.provider_internal_venue_name ?`, ${event.venue || event.provider_internal_venue_name}` : ''}
                </p>
              </>
            )}
            <h2 className={styles.subTitle}>
              {t("Buy tickets to")} {event.name[language]}
            </h2>
            <p className={styles.ticketPrice}>
              {t("Tickets price from")}: {event.price_min}{" "}
              {event.price_currency}
            </p>
            <p className={styles.ticketPrice}>
              {t("Tickets price to")}: {event.price_max} {event.price_currency}
            </p>
            <div className={styles.buttonWrapper}>
              <button
                onClick={handleAffiliateClick}
                className={styles.buyButton}
              >
                {t("Buy tickets")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className={styles.relatedEvents}>
          <h2 className={styles.groupTitle}>
            {groupName} {t("tickets")} {new Date().getFullYear()},{" "}{new Date().getFullYear() + 1}
          </h2>
          <div className={globalStyles.eventCardsList}>
            {related.map((event) => (
              <EventCard event={event} key={event._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className={styles.eventWrapper}>Loading...</div>
  );
};

export const getStaticPaths = async () => {
  const everywhere_url = `${process.env.API_PREFIX}/events?ssr=true&size=10000&select=group_alias,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&sort=start_asc&locale=${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}`;
  const response = await fetch(everywhere_url);
  const events: Event[] = await response.json();
  const paths = events.map((event) => ({
    params: { alias: event.alias, group: performGroupAliasFromEvent(event) },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context: {
  params: { alias: string; group: string };
}) => {
  const { alias, group } = context.params;
  const language = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";

  const event = await getEvent(alias);

  if (!event) {
    return {
      notFound: true,
    };
  }

  const related = await getRelated(group);

    const groupName = event?.group_name[language] ?? group
        .replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return {
    props: {
      event,
      related,
      group,
      alias,
      groupName,
      locale: language,
        cityName: event.city_name?.[language] ?? event.provider_city_name,
    },
  };
};

export default EventPage;
