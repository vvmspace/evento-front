// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { connectToDb } from "../../../../core/utils/db";

export const listHandler: APIGatewayProxyHandler = async () => {
  await connectToDb();
  const items = await EventModel.find({});

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
