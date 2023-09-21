import globalStyles from "../../styles/Global.module.css";
import { FC } from "react";
import EventCard, {performGroupAliasFromEvent} from "@/components/EventCard/EventCard";
import { Event } from "@/models/event.model";
import Head from "next/head";
import { t } from "@/libs/t";

type GroupPageProps = {
  events: Event[];
  group: string;
  title: string;
  description?: string;
  groupName: string;
};

let cachedGroups: Record<string, Partial<Event>[]> = {};

const getEvents = async (group: string) => {
  if (cachedGroups[group]) {
    return cachedGroups[group] as Event[];
  }
  const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=group_alias,provider_city_name,country,provider_city_name,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=12&everywhere=${group}&sort=start_asc&locale=${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}`;
  const group_response = await fetch(everywhere_url);
  const events: Event[] = await group_response.json();
  cachedGroups[group] = events;
  return events as Event[];
};
const GroupPage: FC<GroupPageProps> = ({ events, group, title, groupName, description }) => {

    if (!group) {
        return <>Loading ...</>
    }
    return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name={"description"}
          content={description ??
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
        {t( "tickets")} {new Date().getFullYear()}, {new Date().getFullYear() + 1}
      </h1>
      <div className={globalStyles.eventCardsList}>
        {events.map((event) => (
          <EventCard event={event} key={event._id} />
        ))}
      </div>
    </>
  );
};

export async function getStaticPaths() {
    const everywhere_url = `${process.env.API_PREFIX}/events?ssr=true&size=10000&select=group_alias,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&sort=start_asc`;
    const response = await fetch(everywhere_url);
    const events: Event[] = await response.json();

    const groups: string[] = events.map((event) => performGroupAliasFromEvent(event));

    const paths = groups
        .filter((group) => !group.includes('['))
        .map((group) => ({
        params: { group },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps(context: {
    params: { group: string };
}) {
    const { group } = context.params;

    const events: Event[] = await getEvents(group).catch(() => []);

    const groupName = group?.replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return {
        props: {
            group,
            events,
            groupName,
            title: `${t(groupName)} ${t("Tickets")}`,
            description: `${t(groupName ?? group)} ${t("Tickets")} ${new Date().getFullYear()}, ${new Date().getFullYear() + 1}: ${events.map((event) => event.name[
                process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE ?? "es"
                ]).join(", ")} ${t("and more")}}`,
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
