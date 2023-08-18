// src/utils/db.ts

import * as AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

export const Dynamo = {
  async get(id: string, TableName: string) {
    const res = await client.get({ TableName, Key: { id } }).promise();

    return res.Item;
  },

  async put(item: {}, TableName: string) {
    await client.put({ TableName, Item: item }).promise();

    return item;
  },

  async query(TableName: string) {
    const res = await client.scan({ TableName }).promise();

    return res.Items;
  },

  async update(id: string, TableName: string, ExpressionAttributeValues: {}) {
    const res = await client
      .update({
        TableName,
        Key: { id },
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return res.Attributes;
  },

  async delete(id: string, TableName: string) {
    await client.delete({ TableName, Key: { id } }).promise();

    return id;
  },
};