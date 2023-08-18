// src/handlers/delete.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { Dynamo } from "../utils/db";
import { ApiGuard } from "../../../../core/guards/api-guard";

const deleteEvent: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);
  const id = event.pathParameters?.id as string;

  await Dynamo.delete(id, process.env.EVENTS_TABLE as string);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Deleted successfully' }),
  };
};

export const deleteHandler = deleteEvent;
