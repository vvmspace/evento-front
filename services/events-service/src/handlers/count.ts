// src/handlers/list.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { EventModel } from "../models/event";
import { connectToDb, disconnectFromDb } from "../../../../core/utils/db";
import { defaultHeaders } from "../../../../core/headers/default.headers";

const active = {
  active: {
    $eq: true,
  },
};
const actual = {
  start: {
    $gte: new Date(),
  },
};
const ssr = {
  ssr: true,
};
export const countHandler: APIGatewayProxyHandler = async () => {
  await connectToDb();
  const SSR = await EventModel.countDocuments({
    ...ssr,
    ...actual,
  });
  const items = await EventModel.countDocuments({
    ...active,
    ...actual,
  });

  const GB = await EventModel.countDocuments({
    provider_internal_country_code: "GB",
    ...active,
    ...actual,
    ...ssr,
  });
  const DE = await EventModel.countDocuments({
    provider_internal_country_code: "DE",
    ...active,
    ...actual,
    ...ssr,
  });
  const FR = await EventModel.countDocuments({
    provider_internal_country_code: "FR",
    ...active,
    ...actual,
    ...ssr,
  });
  const ES = await EventModel.countDocuments({
    provider_internal_country_code: "ES",
    ...active,
    ...actual,
    ...ssr,
  });
  const MX = await EventModel.countDocuments({
    provider_internal_country_code: "MX",
    ...active,
    ...actual,
    ...ssr,
  });
  const US = await EventModel.countDocuments({
    provider_internal_country_code: "US",
    ...active,
    ...actual,
    ...ssr,
  });
  const AR = await EventModel.countDocuments({
    provider_internal_country_code: "AR",
    ...active,
    ...actual,
    ...ssr,
  });
  const next_month_ssr = await EventModel.countDocuments({
    ...ssr,
    ...active,
    start: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      $lte: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    },
  });
  await disconnectFromDb();
  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({
      items,
      next_month_ssr,
      SSR,
      AR,
      MX,
      ES,
      US,
      FR,
      DE,
      GB,
    }),
  };
};
