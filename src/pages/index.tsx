import globalStyles from '../styles/Global.module.css';
import {FC} from "react";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import EventCard from "../components/EventCard/EventCard";
import {Event} from "../models/event.model";
import {LOCALES} from "@/constants/locales.constants";
import Head from "next/head";

type Props = {
    top: Event[];
    latest: Event[];
    title: string;
};

const DEFAULT_LANGUAGE = process?.env?.locale ?? 'es';

const HomePage: FC<Props> = ({ latest, top, title }) => {
    const { t } = useTranslation('common');
    return (<>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{t('New events')}</h1>
            <div className={globalStyles.eventCardsList}>
                {latest.map(event => (
                    <EventCard event={event} key={event._id} />
                ))}
            </div>
            <h2>{t('Top events')}</h2>
            <div className={globalStyles.eventCardsList}>
                {top.map(event => (
                    <EventCard event={event} key={event._id} />
                ))}
            </div>
        </>
    );
}

export async function getStaticProps() {
    const latest_response = await fetch(`${process.env.API_PREFIX}/events?active=true&select=country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=8&sort=updatedAt_desc`, {
        next: {
            revalidate: 7200
        }
    });
    const latest: Event[] = await latest_response.json();

    const top_response = await fetch(`${process.env.API_PREFIX}/events?active=true&select=country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=4&price_currency=EUR&sort=price_max_desc`, {
        next: {
            revalidate: 7200
        }
    });
    const top: Event[] = await top_response.json();

    return {
        props: {
            ...await serverSideTranslations(DEFAULT_LANGUAGE, ['common']),
            latest,
            top,
            title: LOCALES[DEFAULT_LANGUAGE as "es" | "en" | "fr"]?.front_title
        },
        revalidate: 7200
    };
}

export default HomePage;
