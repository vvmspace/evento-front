import React from 'react';
import Link from 'next/link';
import styles from './EventCard.module.css';
import { useTranslation } from "next-i18next";
import { Event } from "../../../../core/models/event.model";

type EventCardProps = {
    event: Event
};

const performUrlFromEvent = (event: Event) => {
    return `/event/${event.alias}`;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { i18n } = useTranslation('common');
    const currentLanguage = i18n.language;

    return (
        <Link href={performUrlFromEvent(event)} className={styles.fullCardLink} title={event.title[currentLanguage]} passHref>
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <img src={event.image} alt={event.name[currentLanguage]} className={styles.cardImage} />
                    <h2 className={styles.cardTitle}>{event.name[currentLanguage]}</h2>
                    <p className={styles.cardAddress}>{event.venue}</p>
                    <p className={styles.cardAddress}>{event.provider_id}</p>
                </div>
                <div className={styles.cardFooter}>
                    <p className={styles.cardPrice}>
                        {event.price_min} - {event.price_max} {event.price_currency}
                    </p>
                </div>
            </div>
        </Link>
    );
}



export default EventCard;
