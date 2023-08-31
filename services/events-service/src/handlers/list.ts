// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { connectToDb, disconnectFromDb } from "../../../../core/utils/db";

export const listHandler: APIGatewayProxyHandler = async (event) => {
  await connectToDb();

  const { from, size, sort } = event.queryStringParameters || {};
  const query = event.queryStringParameters || {} as unknown;
  let mongoQuery = {};
  let sortQuery = {};
  ['query', 'from', 'size', 'sort'].forEach((key) => {
    if (event.queryStringParameters && event.queryStringParameters[key]) {
      delete event.queryStringParameters[key];
    }
  });

  if (sort) {
    if (sort.endsWith('_asc')) {
      sortQuery[sort.slice(0, -4)] = 1;
    } else if (sort.endsWith('_desc')) {
      sortQuery[sort.slice(0, -5)] = -1;
    } else {
      sortQuery[sort] = 1; // по умолчанию asc
    }
  }

  for (let [key, value] of Object.entries(query)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        for (let [subKey, subValue] of Object.entries(value)) {
          const compositeKey = `${key}.${subKey}`;

          // обработка from и to
          if (subKey.endsWith('_from')) {
            mongoQuery[compositeKey.slice(0, -5)] = { $gte: subValue };
          } else if (subKey.endsWith('_to')) {
            mongoQuery[compositeKey.slice(0, -3)] = { $lte: subValue };
          } else {
            mongoQuery[compositeKey] = subValue;
          }
        }
      } else {
        if (key.endsWith('_from')) {
          mongoQuery[key.slice(0, -5)] = { $gte: value };
        } else if (key.endsWith('_to')) {
          mongoQuery[key.slice(0, -3)] = { $lte: value };
        } else {
          mongoQuery[key] = value;
        }
      }
    }

  const items = await EventModel.find(mongoQuery)
      .sort(sortQuery)
      .skip(Number(from || 0))
      .limit(Number(size || 100));

  await disconnectFromDb();

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};

