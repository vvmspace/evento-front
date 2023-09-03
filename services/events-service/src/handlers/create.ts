import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { EventModel } from "../models/event";
import { connectToDb } from "../../../../core/utils/db";
import { defaultHeaders } from "../../../../core/headers/default.headers";

const createEvent: APIGatewayProxyHandler = async (event) => {
  await connectToDb();
  ApiGuard(event);
  const data = JSON.parse(event.body as string);

  const item = new EventModel(data);
  await item.save();

  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(item),
  };
};

export const createHandler = createEvent;
