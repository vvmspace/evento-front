import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { EventModel } from "../models/event";
import { connectToDb } from "../../../../core/utils/db";
import { defaultHeaders } from "../../../../core/headers/default.headers";
import { NotifyServiceAdapter } from "../../../../core/adapters/notifications.adapter";

const notifyService = new NotifyServiceAdapter();

const upsertEvent: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);
  await connectToDb();
  const data = JSON.parse(event.body as string);

  const { provider_id, provider_internal_id } = data;

  const existingItem = await EventModel.findOne({
    provider_id,
    provider_internal_id,
  });

  let item;

  if (existingItem) {
    existingItem.set(data);
    await existingItem.save();
    item = existingItem;
  } else {
    item = new EventModel(data);
    item.active &&
      (await notifyService.sendNotification({
        message: `*New event:* 
${item.provider_internal_name}
${item.start ?? ""} - ${item.end ?? ""}

${item.provider_internal_description ?? ""}
${item.link}

*Info:*
${item.provider_internal_info ?? ""}

*Note:*
${item.provider_internal_note ?? ""}

*Location:*
${item.provider_internal_venue_name ?? ""}`,
        from: "events-service",
      }));
    await item.save();
  }

  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(item),
  };
};

export const upsertHandler = upsertEvent;
