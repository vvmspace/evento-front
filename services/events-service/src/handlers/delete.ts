// src/handlers/delete.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from '../models/event';
import { ApiGuard } from "../../../../core/guards/api-guard";

const deleteEvent: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);
  const id = event.pathParameters?.id as string;

  await EventModel.findByIdAndDelete(id);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Deleted successfully' }),
  };
};

export const deleteHandler = deleteEvent;
