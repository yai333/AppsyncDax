"use strict";
const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");

const AmazonDaxClient = require("amazon-dax-client");
const dax = new AmazonDaxClient({
  endpoints: process.env.DAX_ENDPOINT,
  region: process.env.AWS_DEFAULT_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient({ service: dax });

module.exports.graphqlHandler = async (event, context, callback) => {
  const { field, arguments: args } = event;

  switch (field) {
    case "getPostsFromDax":
      const params = {
        TableName: process.env.POSTS_TABLE_NAME
      };
      try {
        const response = await documentClient.scan(params).promise();
        callback(null, response);
      } catch (err) {
        callback(err, null);
      }
      break;
    case "addPostViaDax":
      try {
        const { title, content } = args;
        const params = {
          Item: {
            id: uuidv4(),
            title: title,
            content: content,
            createdAt: new Date().toLocaleString()
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: process.env.POSTS_TABLE_NAME
        };

        const response = await documentClient.put(params).promise();
        callback(null, response);
      } catch (err) {
        callback(err, null);
      }
      break;
    default: {
      callback(`Unknown function received, unable to resolve ${field}`, null);
      break;
    }
  }
};
