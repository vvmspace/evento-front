// src/handlers/update.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { Dynamo } from "../utils/db";
import { ApiGuard } from "../../../../core/guards/api-guard";

const updateEvent: APIGatewayProxyHandler = async (event) => {
  ApiGuard(event);
  const data = JSON.parse(event.body as string);
  const id = event.pathParameters?.id as string;

  const item = await Dynamo.update(id, data, process.env.EVENTS_TABLE as string);

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export const updateHandler = updateEvent;