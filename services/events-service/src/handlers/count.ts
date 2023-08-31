// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { connectToDb } from "../../../../core/utils/db";

const not_cancelled = {
  "original.dates.status.code": {
    $ne: "cancelled",
  },
};
export const countHandler: APIGatewayProxyHandler = async () => {
  await connectToDb();
  const items = await EventModel.countDocuments({});
  const items_not_cancelled = await EventModel.countDocuments({
    ...not_cancelled,
  });
  const this_year = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(),
      $lte: new Date(new Date().getFullYear(), 11, 31),
    },
    ...not_cancelled,
  });
  const next_year = await EventModel.countDocuments({
    start: {
      // from the start of the next year to the end of the next year
      $gte: new Date(new Date().getFullYear() + 1, 0, 1),
      $lte: new Date(new Date().getFullYear() + 1, 11, 31),
    },
    ...not_cancelled,
  });
  const with_description = await EventModel.countDocuments({
    "original.description": {
      $exists: true,
    },
    ...not_cancelled,
  });
  const this_year_with_description = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(),
      $lte: new Date(new Date().getFullYear(), 11, 31),
    },
    "original.description": {
      $exists: true,
    },
    ...not_cancelled,
  });
  const next_year_with_description = await EventModel.countDocuments({
    start: {
      // from the start of the next year to the end of the next year
      $gte: new Date(new Date().getFullYear() + 1, 0, 1),
      $lte: new Date(new Date().getFullYear() + 1, 11, 31),
    },
    "original.description": {
      $exists: true,
    },
    ...not_cancelled,
  });
  const next_month = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    ...not_cancelled,
  });
  const next_month_with_description = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    "original.description": {
      $exists: true,
    },
    ...not_cancelled,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      items,
      items_not_cancelled,
      this_year,
      next_year,
      with_description,
      this_year_with_description,
      next_year_with_description,
      next_month,
      next_month_with_description,
    }),
  };
};
