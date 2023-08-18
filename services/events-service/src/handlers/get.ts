// src/handlers/get.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { Dynamo } from "../utils/db";

const getHandler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id as string;
  const item = await Dynamo.get(id, process.env.EVENTS_TABLE as string);

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export default getHandler;