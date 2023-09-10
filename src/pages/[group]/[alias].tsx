import { FC } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Event } from "../../models/event.model";
import { fetch } from "next/dist/compiled/@edge-runtime/primitives";
import Head from "next/head";

type EventPageProps = {
    event: Event;
};

const EventPage: FC<EventPageProps> = ({ event }) => {
    const { t, i18n } = useTranslation('common');

    const affiliateLink = (event: Event): string => event.link;

    const handleAffiliateClick = () => {
        const link = affiliateLink(event);
        if (link) {
            window.open(link, '_blank');
        }
    };

    return (
        <div>
            <Head>
                <title>{event.title[i18n.language]} | {event?.call_for_action_text?.[i18n.language] ?? ''}</title>
                <meta name="description" content={event.description[i18n.language] ?? ''} />
            </Head>
            <h1>{event.name[i18n.language]}</h1>
            <img src={event.image} alt={event.name[i18n.language]} />
            <p>{event.description[i18n.language]}</p>
            {event.venue && <p>{t('venue')}: {event.venue}</p>}
            <p>{t('price')}: {event.price_min} - {event.price_max} {event.price_currency}</p>

            <button onClick={handleAffiliateClick} style={{ /* ваш стиль для кнопки, как и на карточке */ }}>
                {t('go_to_event')}
            </button>
        </div>
    );
}

export async function getServerSideProps(context: { params: { alias: string }; locale: string }) {
    const { alias } = context.params;

    const response = await fetch(`${process.env.API_PREFIX}/events?select=updatedAt,image,description,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency,link&ssr=true&alias=${alias}`, {
        next: {
            revalidate: 7200
        }
    });
    const [event] = await response.json();
    if (!event) {
        console.log('event not found', alias);
        return {
            notFound: true,
        }
    }

    return {
        props: {
            event,
            ...await serverSideTranslations(context.locale, ['common']),
            title: event.title[context.locale],
            description: event.description[context.locale]
        }
    };
}

export default EventPage;
