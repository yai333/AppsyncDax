"use strict";
const AWS = require("aws-sdk");

module.exports.graphqlHandler = async (event, context, callback) => {
  const { field, arguments: args } = event;
  console.log(field);
  switch (field) {
    case "getPostsFromDax":
      callback(null);
      break;
    case "addPostViaDax":
      callback(null);
      break;
    default: {
      callback(`Unknown function received, unable to resolve ${field}`, null);
      break;
    }
  }
};
