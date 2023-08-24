// src/handlers/get.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { connectToDb } from "../../../../core/utils/db";

const getHandler: APIGatewayProxyHandler = async (event) => {
  await connectToDb();
  const id = event.pathParameters?.id as string;

  const item = await EventModel.findById(id);

  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Item not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export default getHandler;
