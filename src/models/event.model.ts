export interface Event {
  _id: string;
  id?: string;
  active?: boolean;
  age_restriction?: string;
  alias: string;
  group_alias?: string;
  group_name?: {
    [language: string]: string;
  };
  group_description?: {
    [language: string]: string;
  };
  city_name?: {
    [language: string]: string;
  };
  start: Date;
  end?: Date;
  updatedAt?: Date;
  name: {
    [language: string]: string;
  };
  title: {
    [language: string]: string;
  };
  description: {
    [language: string]: string;
  };
  call_for_action: {
    [language: string]: string;
  };
  cancelled?: boolean;
  price_min?: number;
  price_max?: number;
  price_currency?: string;
  link: string;
  image?: string;
  validated_at?: Date;
  updated_at?: Date;
  latitude?: number;
  longitude?: number;
  original?: any;
  provider_city_name?: string;
  provider_id: string;
  provider_internal_id: string;
  provider_internal_category_id?: string;
  provider_internal_city_name?: string;
  provider_internal_country_code?: string;
  provider_internal_country_name?: string;
  provider_internal_description?: string;
  provider_internal_facebook_event_id?: string;
  provider_internal_format_id?: string;
  provider_internal_info?: string;
  provider_internal_locale?: string;
  provider_internal_logo_id?: string;
  provider_internal_organizer_id?: string;
  provider_internal_state_code?: string;
  provider_internal_state_name?: string;
  provider_internal_name?: string;
  provider_internal_note?: string;
  provider_internal_subcategory_id?: string;
  provider_internal_sub_genre_id?: string;
  provider_internal_type: string;
  provider_internal_venue_id?: string;
  provider_internal_venue_address?: string;
  provider_internal_venue_name?: string;
  genre?: string;
  ssr: boolean;
  sub_genre?: string;
  timezone?: string;
  venue?: string;
}
