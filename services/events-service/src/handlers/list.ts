// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { Dynamo } from "../utils/db";

export const listHandler: APIGatewayProxyHandler = async () => {
  console.log(process.env.EVENTS_TABLE);
  const items = await Dynamo.query(process.env.EVENTS_TABLE as string);

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};