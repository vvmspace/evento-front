export interface Event {
  _id: string;
  id?: string;
  active?: boolean;
  alias: string;
  start: Date;
  end?: Date;
  name: {
    [language: string]: string;
  };
  title: {
    [language: string]: string;
  };
  description: {
    [language: string]: string;
  };
  call_for_action_text: {
    [language: string]: string;
  };
  cancelled?: boolean;
  price_min?: number;
  price_max?: number;
  price_currency?: string;
  provider_id: string;
  provider_internal_id: string;
  link: string;
  image?: string;
  validated_at?: Date;
  updated_at?: Date;
  ssr: boolean;
  provider_internal_name?: string;
  provider_internal_description?: string;
  provider_internal_info?: string;
  provider_internal_note?: string;
  provider_internal_facebook_event_id?: string;
  provider_internal_logo_id?: string;
  provider_internal_organizer_id?: string;
  provider_internal_venue_id?: string;
  provider_internal_venue_name?: string;
  provider_internal_venue_address?: string;
  provider_internal_category_id?: string;
  provider_internal_subcategory_id?: string;
  provider_internal_sub_genre_id?: string;
  provider_internal_format_id?: string;
  genre?: string;
  sub_genre?: string;
  venue?: string;
  original?: any;
  latitude?: number;
  longitude?: number;
}
