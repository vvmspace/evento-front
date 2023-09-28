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
                <lastmod>${event.updatedAt ?? new Date().toISOString()}</lastmod>
                <priority>0.8</priority>
                <changefreq>weekly</changefreq>
            </url>`;
  };

  const renderGroupUrl = (group: string) => {
    return `<url>
                <loc>${process.env.URL_PREFIX}/${group}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <priority>0.5</priority>
                <changefreq>daily</changefreq>
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
                  ...new Set(
                    events.map(
                      (event) =>
                        event.provider_city_name?.toLowerCase() as string,
                    ),
                  ),
                ]
                  .filter((group) => !!group)
                  .map((group) => renderGroupUrl(group))}
                ${events.map((event) => renderEventUrl(event))}
                <url>
                    <loc>${process.env.URL_PREFIX}/</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <priority>1.0</priority>
                    <changefreq>daily</changefreq>
                </url>
            </urlset>`;
  };

  const everywhere_url = `${process.env.API_PREFIX}/events?active=true&ssr=true&select=group_alias,country,genre,updatedAt,image,name,alias,start,price_min,price_max,title,call_for_action,venue,provider_id,provider_internal_venue_address,price_currency&ssr=true&size=10000&sort=start_asc&locale=${process.env.NEXT_PUBLIC_DOMAIN_LANGUAGE}`;
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
