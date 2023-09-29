import globalStyles from "../styles/Global.module.css";
import { FC } from "react";
import EventCard from "../components/EventCard/EventCard";
import { Event } from "@/models/event.model";
import { LOCALES } from "@/constants/locales.constants";
import Head from "next/head";
import { t } from "@/libs/t";

type Props = {
  top: Event[];
  latest: Event[];
  title: string;
};

const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es";

const HomePage: FC<Props> = ({ latest, top, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{t("New events")}</h1>
      <div className={globalStyles.eventCardsList}>
        {latest.map((event) => (
          <EventCard event={event} key={event._id} />
        ))}
      </div>
      <h2>{t("Top events")}</h2>
      <div className={globalStyles.eventCardsList}>
        {top.map((event) => (
          <EventCard event={event} key={event._id} />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const latest_response = await fetch(
    `${
      process.env.API_PREFIX
    }/events?active=true&select=group_alias,city_name,country,provider_city_name,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&distinct=provider_city_name&ssr=true&size=8&use_cache=true&start_from=${
      new Date().toISOString().split("T")[0]
    }&sort=start_asc&locale=${DEFAULT_LANGUAGE}`,
    {
      next: {
        revalidate: 24 * 60 * 60,
      },
    },
  );
  const latest: Event[] = await latest_response.json();

  const top_response = await fetch(
    `${
      process.env.API_PREFIX
    }/events?use_cache=true&active=true&select=group_alias,city_name,country,genre,updatedAt,image,name,alias,start,provider_city_name,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=4&price_max_from=120&use_cache=true&distinct=group_alias&start_from=${
      new Date().toISOString().split("T")[0]
    }&sort=${
      LOCALES[DEFAULT_LANGUAGE as string]?.top_sort ?? "start_asc"
    }&locale=${DEFAULT_LANGUAGE}${
      LOCALES[DEFAULT_LANGUAGE as string]?.currency
        ? `&price_currency=${LOCALES[DEFAULT_LANGUAGE as string]?.currency}`
        : ""
    }`,
    {
      next: {
        revalidate: 7200,
      },
    },
  );
  const top: Event[] = await top_response.json();

  return {
    props: {
      locale: DEFAULT_LANGUAGE,
      latest,
      top,
      title:
        LOCALES[DEFAULT_LANGUAGE as "es" | "en" | "fr" | "am"]?.front_title,
    },
  };
}

export default HomePage;
export const config = {
  amp: "hybrid",
};
