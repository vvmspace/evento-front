import React from 'react';
import Link from 'next/link';
import styles from './EventCard.module.css';
import { useTranslation } from "next-i18next";
import { Event } from "../../models/event.model";

type EventCardProps = {
    event: Event
};

export const performGroupAliasFromEvent = (event: Event): string => {
    const group = (event.provider_internal_country_name
        || event.provider_internal_state_name
        || event.sub_genre
        || event.genre
        || event.provider_city_name
        || event.provider_internal_venue_name
        || event.provider_internal_country_code
        || 'event').toLowerCase().replaceAll(' ', '%20').replaceAll('&',
            '%26'
        );
    console.log('group', group);
    return group;
}
const performUrlFromEvent = (event: Event) => {
    const url = (typeof window === 'undefined' ?
    process.env.URL_PREFIX : window?.location?.origin) + '/'
         + `${performGroupAliasFromEvent(event)}/${event.alias}`;
    return url;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { i18n } = useTranslation('common');
    const currentLanguage = i18n.language;

    return (
        <Link href={performUrlFromEvent(event)} className={styles.fullCardLink} title={event.title[currentLanguage]} passHref>
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <img src={event.image} alt={event.name[currentLanguage]} className={styles.cardImage} />
                    <h2 className={styles.cardTitle}>{event.name[currentLanguage] ?? event.name['en']}</h2>
                    <p className={styles.cardStartDate}>
                        {new Date(event.start).toLocaleDateString(currentLanguage, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <p className={styles.cardStartTime}>{
                        new Date(event.start).toLocaleTimeString(currentLanguage, {
                            hour: 'numeric',
                            minute: 'numeric',
                        })
                    }</p>
                    <p className={styles.cardAddress}>{event.venue || event.provider_internal_venue_name || event.provider_city_name}</p>
                </div>
                <div className={styles.cardFooter}>
                    <p className={styles.cardPrice}>
                        {event.price_min && event.price_min !== event.price_max && `${event.price_min} - ` || ''}{event.price_max} {event.price_currency}
                    </p>
                </div>
            </div>
        </Link>
    );
}



export default EventCard;
