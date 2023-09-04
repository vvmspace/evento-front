// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { connectToDb } from "../../../../core/utils/db";
import { defaultHeaders } from "../../../../core/headers/default.headers";

const not_cancelled = {
  cancelled: {
    $ne: true,
  },
};
const active = {
  active: {
    $eq: true,
  },
};
export const countHandler: APIGatewayProxyHandler = async () => {
  await connectToDb();
  const ssr = await EventModel.countDocuments({ ssr: true });
  const items = await EventModel.countDocuments({});
  const items_not_cancelled = await EventModel.countDocuments({
    ...not_cancelled,
  });
  const items_validated = await EventModel.countDocuments({
    validated_at: {
      $exists: true,
    },
  });
  const items_validated_future = await EventModel.countDocuments({
    validated_at: {
      $exists: true,
    },
    start: {
      $gte: new Date(),
    },
  });
  const items_active = await EventModel.countDocuments({
    ...active,
  });
  const items_active_future = await EventModel.countDocuments({
    ...active,
    start: {
      $gte: new Date(),
    },
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
      $gte: new Date(new Date().getFullYear() + 1, 0, 1),
      $lte: new Date(new Date().getFullYear() + 1, 11, 31),
    },
    ...active,
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
    provider_internal_description: {
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
    provider_internal_description: {
      $exists: true,
    },
    ...not_cancelled,
  });
  const this_month = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    ...not_cancelled,
  });
  const this_month_with_description = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    provider_internal_description: {
      $exists: true,
    },
    ...not_cancelled,
  });
  const next_month = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    },
    ...not_cancelled,
  });
  const next_month_with_description = await EventModel.countDocuments({
    start: {
      // from now to the end of the year
      $gte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    },
    provider_internal_description: {
      $exists: true,
    },
    ...not_cancelled,
  });
  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({
      ssr,
      items,
      items_not_cancelled,
      items_active,
      items_active_future,
      items_validated,
      items_validated_future,
      this_year,
      next_year,
      with_description,
      this_year_with_description,
      next_year_with_description,
      this_month,
      this_month_with_description,
      next_month,
      next_month_with_description,
    }),
  };
};
