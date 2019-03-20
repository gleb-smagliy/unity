"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetServicesByVersionQuery = void 0;

var _schemaMappings = require("./schema-mappings");

var _executeDynamodbOperation = require("../execute-dynamodb-operation");

const createQueryParams = ({
  version,
  tableName
}) => ({
  TableName: tableName,
  FilterExpression: 'Version = :version and SchemaItemType = :type',
  ExpressionAttributeValues: {
    ':version': version,
    ':type': _schemaMappings.ITEM_TYPE.SERVICE
  }
});

const transformError = err => `GetServicesByVersionQuery:: ${err.message}`;

const createGetServicesByVersionQuery = ({
  docClient,
  tableName
}) => async ({
  version
}) => {
  const params = createQueryParams({
    version,
    tableName
  });
  console.log('createGetServicesByVersionQuery::params:', params);
  return (0, _executeDynamodbOperation.execute)(docClient.scan(params), {
    transformPayload: _schemaMappings.toServices,
    transformError
  });
};

exports.createGetServicesByVersionQuery = createGetServicesByVersionQuery;