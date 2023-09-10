import { FC } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Event } from "../../models/event.model";
import { fetch } from "next/dist/compiled/@edge-runtime/primitives";
import Head from "next/head";
import EventCard, {performGroupAliasFromEvent} from "@/components/EventCard/EventCard";
import styles from './EventPage.module.css';
import globalStyles from '../../styles/Global.module.css';
import NotFound from "next/dist/client/components/not-found-error";

type EventPageProps = {
    event: Event;
    related: Event[];
    alias: string;
    group: string;
};

const cachedRelated: {
    [key: string]: Event[]
} = {}

const getRelated = async (group: string) => {
    if (cachedRelated[group]) {
        console.log('related from cache', group, cachedRelated[group].length, 'events');
        return cachedRelated[group];
    }
    const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=4&everywhere=${group}&sort=start_asc`;
    const group_response = await fetch(everywhere_url);
    console.log('everywhere_url', everywhere_url);
    const related: Event[] = await group_response.json();
    cachedRelated[group] = related;
    return related;

}

const EventPage: FC<EventPageProps> = ({ event, related, group, alias }) => {
    const { t, i18n } = useTranslation('common');

    const affiliateLink = (event: Event): string => event.link;

    const handleAffiliateClick = () => {
        const link = affiliateLink(event);
        if (link) {
            window.open(link, '_blank');
        }
    };

    if (!event && alias?.includes('20')) {
        const fake_title = alias ? alias.split('').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' ' + group : '';
        return (<div className={styles.eventWrapper}>
            <Head>
                <title>{fake_title}</title>
            </Head>
            <h1>{fake_title} {group}</h1>
            <div>
                <p>{t('Event is expired or will be available later')}</p>
            </div>
            )
        </div>);
    }

    if (!event) {
        return NotFound();
    }

    return (
        <div className={styles.eventWrapper}>
            <Head>
                <title>{event.title[i18n.language]} | {event?.call_for_action_text?.[i18n.language] ?? ''}</title>
                <meta name="description" content={event.description[i18n.language] ?? ''} />
            </Head>
            <h1 className={styles.eventTitle}>{event.name[i18n.language]}</h1>
            <div className={styles.eventContent}>
                <div className={styles.card}>
                    <div className={styles.image}>
                        <img src={event.image} alt={event.name[i18n.language]} />
                    </div>
                    <div className={styles.description}>
                        <p>{event.description[i18n.language]}</p>
                        {event.venue && <p className={styles.venue}>{t('venue')}: {event.venue}</p>}
                        <h2 className={styles.ticketTitle}>{t('Buy tickets to')} {event.name[i18n.language]}</h2>
                        <p className={styles.ticketPrice}>{t('price')}: {event.price_min} - {event.price_max} {event.price_currency}</p>
                        <div className={styles.buttonWrapper}>
                            <button onClick={handleAffiliateClick} className={styles.buyButton}>
                                {t('Buy tickets')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {related.length > 0 && (
                <div className={styles.relatedEvents}>
                    <h2 className={styles.groupTitle}>{group.charAt(0).toUpperCase() + group.slice(1)}</h2>
                    <div className={globalStyles.eventCardsList}>
                        {related.map(event => (
                            <EventCard event={event} key={event._id} />
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
}

export async function getStaticPaths() {
    const response = await fetch(`${process.env.API_PREFIX}/events?select=provider_internal_country_name,provider_internal_state_name,sub_genre,genre,provider_city_name,provider_internal_venue_name,provider_internal_country_code,alias&ssr=true&size=10000&sort=createdAt_desc`);
    const events: Partial<Event>[] = await response.json();

    return {
        paths: events
            .filter(event => event.alias)
            .map(event => ({
            params: {
                alias: event.alias,
                group: performGroupAliasFromEvent(event as Event)
            }
        })),
        fallback: true
    };
}
export async function getStaticProps(context: { params: { alias: string, group: string }; locale: string }) {
    const { alias, group } = context.params;

    console.log('alias', alias, 'group', group);

    const response = await fetch(`${process.env.API_PREFIX}/events?select=updatedAt,image,description,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency,link&ssr=true&alias=${alias}`);

    let event = null;
    event = (await response.json())[0];
    console.log('event', event)

    if (!event) {
        // if not by alias, try by everywhere & alias
        const everywhere_url = `${process.env.API_PREFIX}/events?ssr=true&select=updatedAt,image,description,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency,link&ssr=true&size=1&everywhere=${alias}&sort=start_asc`;
        const everywhere_response = await fetch(everywhere_url);
        event = (await everywhere_response.json())[0];
    }

    console.log('event', event)
    const related = await getRelated(group);



    if (!event) {
        console.log('event not found', alias);
        return {
            notFound: true,
        }
    }

    return {
        props: {
            event,
            related,
            group,
            alias,
            ...await serverSideTranslations(context.locale, ['common']),
            title: event.title[context.locale],
            description: event.description[context.locale]
        }
    };
}

export default EventPage;
