import globalStyles from "../../styles/Global.module.css";
import { FC } from "react";
import EventCard from "@/components/EventCard/EventCard";
import { Event } from "@/models/event.model";
import Head from "next/head";
import { t } from "@/libs/t";

type GroupPageProps = {
  events: Event[];
  group: string;
  title: string;
  groupName: string;
};

let cachedGroups: Record<string, Partial<Event>[]> = {};

const getEvents = async (group: string) => {
  if (cachedGroups[group]) {
    console.log("group from cache", group);
    return cachedGroups[group] as Event[];
  }
  const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=provider_city_name,country,provider_city_name,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=12&everywhere=${group}&sort=start_asc`;
  const group_response = await fetch(everywhere_url);
  console.log("everywhere_url", everywhere_url);
  const events: Event[] = await group_response.json();
  cachedGroups[group] = events;
  return events as Event[];
};
const GroupPage: FC<GroupPageProps> = ({ events, group, title, groupName }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>
        {groupName ? t(groupName) : t(`${group.charAt(0).toUpperCase() + group.slice(1)}`)} {t("Events")} {new Date().getFullYear()}, {new Date().getFullYear() + 1}
      </h1>
      <div className={globalStyles.eventCardsList}>
        {events.map((event) => (
          <EventCard event={event} key={event._id} />
        ))}
      </div>
    </>
  );
};

export async function getServerSideProps(context: {
  params: { group: string };
}) {
  const { group } = context.params;

  const events: Event[] = await getEvents(group);

  const groupName = group.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return {
    props: {
      group,
      events,
      groupName,
      title: `${t(groupName)} ${t(
        "Tickets",
      )}`,
    },
  };
}

export default GroupPage;
