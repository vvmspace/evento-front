// src/handlers/update.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { Dynamo } from "../utils/db";

const updateEvent: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body as string);
  const id = event.pathParameters?.id as string;

  const item = await Dynamo.update(id, data, process.env.EVENTS_TABLE as string);

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export const updateHandler = updateEvent;