import { FC } from "react";
import { Event } from "@/models/event.model";
import { fetch } from "next/dist/compiled/@edge-runtime/primitives";
import Head from "next/head";
import EventCard from "@/components/EventCard/EventCard";
import styles from "../../styles/EventPage.module.css";
import globalStyles from "../../styles/Global.module.css";
import NotFound from "next/dist/client/components/not-found-error";
import { t } from "@/libs/t";
import EventJSONLd from "@/components/EventJSONLd";
import Link from "next/link";

type EventPageProps = {
  event: Event;
  related: Event[];
  alias: string;
  group: string;
  cityName: string;
};

const cachedRelated: {
  [key: string]: Event[];
} = {};

const getRelated = async (group: string) => {
  if (cachedRelated[group]) {
    console.log(
      "related from cache",
      group,
      cachedRelated[group].length,
      "events",
    );
    return cachedRelated[group];
  }
  const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=provider_city_name,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=4&everywhere=${group}&sort=start_asc`;
  const group_response = await fetch(everywhere_url);
  console.log("everywhere_url", everywhere_url);
  const related: Event[] = await group_response.json();
  cachedRelated[group] = related;
  return related;
};

const cachedEvents: Record<string, Partial<Event>> = {};

const getEvent = async (alias: string) => {
  if (cachedEvents[alias]) {
    console.log("event from cache", alias);
    return cachedEvents[alias];
  }
  const response = await fetch(
    `${process.env.API_PREFIX}/events?select=updatedAt,image,description,name,alias,start,provider_city_name,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency,link&ssr=true&alias=${alias}`,
  );
  const event = (await response.json())[0];
  cachedEvents[alias] = event;
  return event;
};

const EventPage: FC<EventPageProps> = ({ event, related, group, alias }) => {
  const language = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";

  const affiliateLink = (event: Event): string => event.link;

  const handleAffiliateClick = () => {
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

  if (!event) {
    return NotFound();
  }

  return (
    <div className={styles.eventWrapper}>
      <Head>
        <title>
          {event.title[language]} |{" "}
          {event.provider_city_name ? `${t(event.provider_city_name)} | ` : ""}
          {event?.call_for_action_text?.[language] ?? ""}
        </title>
        <meta name="description" content={event.description[language] ?? ""} />
        <meta property="og:title" content={event.title[language]} />
        <meta
          property="og:description"
          content={event.call_for_action_text?.[language] ?? ""}
        />
        <meta property="og:image" content={event.image} />
      </Head>
      <h1 className={styles.eventTitle}>{event.name[language]}</h1>
      <div className={styles.eventContent}>
        <EventJSONLd event={event} />
        <div className={styles.card}>
          <div className={styles.image}>
            <img src={event.image} alt={event.name[language]} />
          </div>
          <div className={styles.description}>
            <div>{event.description[language]}</div>
            <div>
              <Link className={globalStyles.tag} href={`/${group}`}>
                {group}
              </Link>{event.provider_city_name ? <>{" "}
              <Link
                className={globalStyles.tag}
                href={`/${event.provider_city_name?.toLowerCase()}`}
              >
                {event.provider_city_name}
              </Link></> : ""}{event.provider_internal_country_name ? <>{" "}
              <Link
                className={globalStyles.tag}
                href={`/${event.provider_internal_country_name?.toLowerCase()}`}
              >
                {event.provider_city_name}
              </Link></> : ""}
            </div>
            {event.start && (
              <>
                <h2 className={styles.subTitle}>{t("When?")}</h2>
                <p className={styles.date}>
                  {t("Date")}: {new Date(event.start).toDateString()}
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
                  {event.provider_city_name
                    ? event.provider_city_name + ", "
                    : ""}{" "}
                  {event.venue ? event.venue : ""}
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
            {group.charAt(0).toUpperCase() + group.slice(1)}
          </h2>
          <div className={globalStyles.eventCardsList}>
            {related.map((event) => (
              <EventCard event={event} key={event._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context: {
  params: { alias: string; group: string };
  locale: string;
}) {
  const { alias, group } = context.params;
  const groupName = group
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const language = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";

  const event = await getEvent(alias);

  if (!event) {
    console.log("event not found", alias);
    return {
      notFound: true,
    };
  }

  const related = await getRelated(group);

  return {
    props: {
      event,
      related,
      group,
      alias,
      locale: language,
    },
  };
}

export default EventPage;
