// src/handlers/update.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { EventModel } from "../models/event";
import {connectToDb} from "../../../../core/utils/db";

const updateEvent: APIGatewayProxyHandler = async (event) => {
  await connectToDb();
  ApiGuard(event);
  const data = JSON.parse(event.body as string);
  const id = event.pathParameters?.id as string;

  const updatedItem = await EventModel.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updatedItem) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Event not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedItem),
  };
};

export const updateHandler = updateEvent;
