import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { EventModel } from "../models/event";
import { disconnectFromDb, connectToDb } from "../../../../core/utils/db";
import { defaultHeaders } from "../../../../core/headers/default.headers";

const updateEvent: APIGatewayProxyHandler = async (event) => {
  await connectToDb();
  ApiGuard(event);
  const data = JSON.parse(event.body as string);
  const id = event.pathParameters?.id as string;

  if (data.alias && data.alias.trim() !== "") {
    const existingEvent = await EventModel.findById(id).catch((err) => {
      console.error(err);
      return null;
    });

    if (existingEvent?.alias !== data.alias) {
      const eventWithSameAlias = await EventModel.findOne({
        alias: data.alias,
        _id: { $ne: id },
      });

      if (eventWithSameAlias) {
        data.alias = `${data.alias}_${id}`;
      }
    }
  }

  delete data._id;
  const updatedItem = await EventModel.findByIdAndUpdate(
    { _id: id },
    { $set: data },
  ).catch((err) => {
    console.error(err);
    return null;
  });

  if (!updatedItem) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Event not found" }),
    };
  }

  await disconnectFromDb();
  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(updatedItem),
  };
};

export const updateHandler = updateEvent;
