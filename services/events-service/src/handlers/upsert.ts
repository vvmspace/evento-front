import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { EventModel } from '../models/event';
import { connectToDb } from "../utils/db";

const upsertEvent: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);
  await connectToDb();
  const data = JSON.parse(event.body as string);

  const { provider_id, provider_internal_id } = data;

  const existingItem = await EventModel.findOne({
    provider_id,
    provider_internal_id
  });

  let item;

  if (existingItem) {
    existingItem.set(data);
    await existingItem.save();
    item = existingItem;
  } else {
    item = new EventModel(data);
    await item.save();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export const upsertHandler = upsertEvent;
