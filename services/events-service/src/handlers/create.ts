import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { EventModel } from '../models/event';
import {connectToDb} from "../utils/db";

const createEvent: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);
  await connectToDb();
  const data = JSON.parse(event.body as string);

  const item = new EventModel(data);
  await item.save();

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export const createHandler = createEvent;
