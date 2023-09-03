import { APIGatewayEvent, Context, Callback, Handler } from "aws-lambda";

export const ApiGuard = (event: APIGatewayEvent) => {
  const expectedApiKey = process.env.API_KEY;
  const providedApiKey = event.headers["X-API-Key"];

  if (providedApiKey !== expectedApiKey) {
    throw new Error(
      `Provided API key ${providedApiKey} does not match expected API key ${expectedApiKey}`,
    );
  }

  return event;
};
