// src/handlers/delete.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { ApiGuard } from "../../../../core/guards/api-guard";
import { connectToDb } from "../../../../core/utils/db";
import { defaultHeaders } from "../../../../core/headers/default.headers";

const deleteEvent: APIGatewayProxyHandler = async (event) => {
  await connectToDb();
  ApiGuard(event);
  const id = event.pathParameters?.id as string;

  await EventModel.findByIdAndDelete(id);

  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({ message: "Deleted successfully" }),
  };
};

export const deleteHandler = deleteEvent;
