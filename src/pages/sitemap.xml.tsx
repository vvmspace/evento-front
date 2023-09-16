// sitemap.xml.tsx

import { GetServerSideProps } from "next";
import { fetch } from "next/dist/compiled/@edge-runtime/primitives";
import { Event } from "@/models/event.model";
import { performGroupAliasFromEvent } from "@/components/EventCard/EventCard";

type SitemapProps = {
  events: Event[];
};

const Sitemap = ({ events }: SitemapProps) => {};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  res,
}) => {
  const renderEventUrl = (event: Event) => {
    const group = performGroupAliasFromEvent(event);
    const alias = event.alias;
    return `<url>
                <loc>${process.env.URL_PREFIX}/${group}/${alias}</loc>
                <lastmod>${event.updatedAt}</lastmod>
            </url>`;
  };

  const renderGroupUrl = (group: string) => {
    return `<url>
                <loc>${process.env.URL_PREFIX}/${group}</loc>
            </url>`;
  };

  const renderSitemap = (events: Event[]) => {
    return `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
                ${[
                  ...new Set(
                    events.map(
                      (event) => performGroupAliasFromEvent(event) as string,
                    ),
                  ),
                ].map((group) => renderGroupUrl(group))}
                ${events.map((event) => renderEventUrl(event))}
            </urlset>`;
  };

  const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=10000&sort=start_asc`;
  const response = await fetch(everywhere_url);
  const events: Event[] = await response.json();

  const sitemap = renderSitemap(events);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return {
    props: {},
  };
};

export default Sitemap;
