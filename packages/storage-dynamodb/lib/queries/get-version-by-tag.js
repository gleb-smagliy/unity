"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetVersionByTagQuery = void 0;

var _executeDynamodbOperation = require("../execute-dynamodb-operation");

var _schemaMappings = require("./schema-mappings");

const transformResult = items => {
  const item = items[0];
  console.log('createGetVersionByTagQuery:item:', item);

  if (typeof item !== 'object') {
    return {
      success: true,
      payload: {
        version: null,
        stage: null
      }
    };
  }

  return {
    success: true,
    payload: {
      version: item.Version,
      stage: item.Stage
    }
  };
};

const createQueryParams = ({
  tag,
  tableName
}) => ({
  TableName: tableName,
  KeyConditionExpression: 'Tag = :tag',
  ExpressionAttributeValues: {
    ':tag': tag
  }
});

const transformError = error => `GetVersionByTagQuery:: ${error.message}`;

const createGetVersionByTagQuery = ({
  docClient,
  tableName
}) => async ({
  tag
}) => {
  const params = createQueryParams({
    tag,
    tableName
  });
  console.log('createGetVersionByTagQuery', params);
  return (0, _executeDynamodbOperation.execute)(docClient.query(params), {
    transformResult,
    transformError
  });
};

exports.createGetVersionByTagQuery = createGetVersionByTagQuery;