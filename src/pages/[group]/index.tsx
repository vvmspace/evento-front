import globalStyles from "../../styles/Global.module.css";
import { FC } from "react";
import EventCard, {
  performGroupAliasFromEvent,
} from "@/components/EventCard/EventCard";
import { Event } from "@/models/event.model";
import Head from "next/head";
import { t } from "@/libs/t";

type GroupPageProps = {
  events: Event[];
  group: string;
  title: string;
  description?: string;
  groupName: string;
  groupDescription?: string;
  link: string;
};

let cachedGroups: Record<string, Partial<Event>[]> = {};

const getEvents = async (group: string) => {
  if (cachedGroups[group]) {
    return cachedGroups[group] as Event[];
  }
  const everywhere_url = `${
    process.env.API_PREFIX
  }/events?use_cache=true&active=true&ssr=true&select=group_alias,group_description,group_name,city_name,provider_city_name,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=12&start_from=${
    new Date().toISOString().split("T")[0]
  }&everywhere=${group}&sort=start_asc&locale=${
    process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE
  }`;
  const group_response = await fetch(everywhere_url, {
    next: {
      revalidate: 24 * 60 * 60,
    },
  });
  const events: Event[] = await group_response.json();
  cachedGroups[group] = events;
  return events as Event[];
};
const GroupPage: FC<GroupPageProps> = ({
  events,
  group,
  title,
  groupName,
  description,
  groupDescription,
  link,
}) => {
  if (!group) {
    return <>Loading ...</>;
  }
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name={"description"}
          content={
            description ??
            t("Buy tickets for") +
              " " +
              groupName +
              " " +
              t("events") +
              " " +
              t("in") +
              " " +
              new Date().getFullYear() +
              " " +
              t("and") +
              " " +
              (new Date().getFullYear() + 1) +
              " " +
              t("at") +
              " " +
              t("site_name")
          }
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={
            description ??
            t("Buy tickets for") +
              " " +
              groupName +
              " " +
              t("events") +
              " " +
              t("in") +
              " " +
              new Date().getFullYear() +
              " " +
              t("and") +
              " " +
              (new Date().getFullYear() + 1) +
              " " +
              t("at") +
              " " +
              t("site_name")
          }
        />
      </Head>
      <h1>
        {groupName
          ? t(groupName)
          : t(`${group.charAt(0).toUpperCase() + group.slice(1)}`)}{" "}
        {t("tickets")} {new Date().getFullYear()},{" "}
        {new Date().getFullYear() + 1}
      </h1>
      {groupDescription ? <p>{groupDescription}</p> : <></>}
      <div className={globalStyles.eventCardsList}>
        {events.map((event) => (
          <EventCard event={event} key={event._id} />
        ))}
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const everywhere_url = `${process.env.API_PREFIX}/events?use_cache=true&ssr=true&size=10000&select=group_alias,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&sort=start_asc`;
  const response = await fetch(everywhere_url);
  const events: Event[] = await response.json();

  const groups: string[] = [
    ...new Set(events.map((event) => performGroupAliasFromEvent(event))),
    ...new Set(
      events.map(
        (event) =>
          event.provider_city_name
            ?.toLowerCase()
            .replaceAll(" ", "%20")
            .replaceAll("&", "%26") as string,
      ),
    ),
  ].filter((group) => !!group);

  const paths = groups
    .filter((group) => !group.includes("["))
    .map((group) => ({
      params: { group },
    }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context: { params: { group: string } }) {
  const { group } = context.params;

  const events: Event[] = (await getEvents(group).catch(() => [])) ?? [];

  const eventsWithGroup = events.filter(
    (e) => !!e?.group_name && e.group_alias === group,
  );

  const groupName =
    eventsWithGroup?.[0]?.group_name?.[
      process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es"
    ] ??
    group
      ?.replaceAll("-", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const groupDescription =
    eventsWithGroup?.[0]?.group_description?.[
      process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es"
    ] ?? "";

  const groups_aliases = [
    ...new Set(
        events.map((event) => event.group_alias || performGroupAliasFromEvent(event)),
    ),
  ].filter((group) => !!group);

  console.log(groups_aliases);

  const groups = groups_aliases.map((group_alias) => {
    const group = events.find((event) => event.group_alias === group_alias);
    return {
      alias: group_alias,
      name: group?.group_name?.[process.env?.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es" as "es" | "en" | "fr" | "am"] ?? group?.group_alias?.replaceAll("-", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
    };
  }).filter((group) => !!group.name);

  return {
    props: {
      group,
      link: `/${group}`,
      events,
      groupName,
      groupDescription,
      groups,
      title: `${t(groupName)} ${t("Tickets")}`,
      description: `${t(groupName ?? group)} ${t(
        "Tickets",
      )} ${new Date().getFullYear()}, ${new Date().getFullYear() + 1}: ${events
        .map(
          (event) =>
            event.name[process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es"],
        )
        .join(", ")} ${t("and more")}}`,
    },
  };
}
// export async function getServerSideProps(context: {
//   params: { group: string };
// }) {
//   const { group } = context.params;
//
//   const events: Event[] = await getEvents(group);
//
//   const groupName = group
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
//
//   return {
//     props: {
//       group,
//       events,
//       groupName,
//       title: `${t(groupName)} ${t("Tickets")}`,
//     },
//   };
// }

export default GroupPage;
export const config = { amp: "hybrid" };