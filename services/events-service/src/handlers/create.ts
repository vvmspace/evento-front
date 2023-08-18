// src/handlers/create.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { Dynamo } from "../utils/db";
import { v4 as uuid } from "uuid";
console.log(process.env.EVENTS_TABLE);
const createEvent: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body as string);
  const id = uuid();

  const item = {
    id,
    ...data,
  };

  await Dynamo.put(item, process.env.EVENTS_TABLE as string);

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export const createHandler = createEvent;