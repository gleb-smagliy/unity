"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetSchemaByVersionQuery = void 0;

var _schemaMappings = require("./schema-mappings");

var _executeDynamodbOperation = require("../execute-dynamodb-operation");

const createQueryParams = ({
  version,
  tableName
}) => ({
  TableName: tableName,
  KeyConditionExpression: 'Version = :version',
  ExpressionAttributeValues: {
    ':version': version
  }
});

const transformPayload = items => ({
  pluginsMetadata: (0, _schemaMappings.toPluginsMetadata)(items),
  services: (0, _schemaMappings.toServices)(items)
});

const transformError = err => `GetSchemaByVersionQuery:: ${err.message}`;

const createGetSchemaByVersionQuery = ({
  docClient,
  tableName
}) => async ({
  version
}) => {
  const params = createQueryParams({
    version,
    tableName
  });
  console.log('GetSchemaByVersionQuery::params:', params);
  return (0, _executeDynamodbOperation.execute)(docClient.query(params), {
    transformPayload,
    transformError
  });
};

exports.createGetSchemaByVersionQuery = createGetSchemaByVersionQuery;