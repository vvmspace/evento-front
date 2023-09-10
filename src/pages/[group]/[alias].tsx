import { FC } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Event } from "../../models/event.model";
import { fetch } from "next/dist/compiled/@edge-runtime/primitives";
import Head from "next/head";
import EventCard from "@/components/EventCard/EventCard";
import styles from './EventPage.module.css';
import globalStyles from '../../styles/Global.module.css';

type EventPageProps = {
    event: Event;
    related: Event[];
    alias: string;
    group: string;
};

const EventPage: FC<EventPageProps> = ({ event, related, group }) => {
    const { t, i18n } = useTranslation('common');

    const affiliateLink = (event: Event): string => event.link;

    const handleAffiliateClick = () => {
        const link = affiliateLink(event);
        if (link) {
            window.open(link, '_blank');
        }
    };

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

export async function getServerSideProps(context: { params: { alias: string, group: string }; locale: string }) {
    const { alias, group } = context.params;

    const response = await fetch(`${process.env.API_PREFIX}/events?select=updatedAt,image,description,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency,link&ssr=true&alias=${alias}`, {
        next: {
            revalidate: 7200
        }
    });
    const [event] = await response.json();

    const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=3&everywhere=${group}&sort=start_asc`;
    const group_response = await fetch(everywhere_url, {
        next: {
            revalidate: 7200
        }
    });
    console.log('everywhere_url', everywhere_url);
    const related: Event[] = await group_response.json();

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
