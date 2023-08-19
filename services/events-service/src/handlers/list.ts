// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from '../models/event';

export const listHandler: APIGatewayProxyHandler = async () => {
  const items = await EventModel.find({});

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
