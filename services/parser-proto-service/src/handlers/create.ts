import { EventServiceAdapter } from "../../../../core/adapters/events.adapter";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Event } from "../../../../core/models/event.model";

const eventService = new EventServiceAdapter();

export const createEvent: APIGatewayProxyHandler = async () => {
  const data: Event = {
    alias: "test",
    start: new Date(),
    name: {
      es: "Evento de prueba",
      en: "Test event",
    },
    description: {
      es: "Descripción de prueba",
      en: "Test description",
    },
    call_for_action_text: {
      es: "Prueba",
      en: "Test",
    },
    price_from: 0,
    price_to: 100,
    price_currency: "USD",
    provider_id: "parser-proto-service",
    provider_internal_id: "test",
    link: "https://example.com",
    image: "https://example.com/image.jpg",
    provider_internal_category_id: "test",
    provider_internal_subcategory_id: "test",
    provider_internal_format_id: "test",
    provider_internal_facebook_event_id: "test",
    provider_internal_logo_id: "test",
    provider_internal_organizer_id: "test",
    provider_internal_venue_id: "test",
    ssr: false,
  };
  const item = await eventService.createEvent(data);
  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};
