// src/handlers/get.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from '../models/event';

const getHandler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id as string;

  const item = await EventModel.findById(id);

  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Item not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

export default getHandler;
