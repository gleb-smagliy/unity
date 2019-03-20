"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUpsertTagCommand = void 0;

var _executeDynamodbOperation = require("../execute-dynamodb-operation");

const createParams = ({
  tableName,
  tag,
  version,
  stage
}) => ({
  TableName: tableName,
  Item: {
    Tag: tag,
    Version: version,
    Stage: stage
  }
});

const transformError = error => `UpsertTagCommand::${error.message}`;

const createUpsertTagCommand = ({
  docClient,
  tableName
}) => async ({
  tag,
  version,
  stage
}) => {
  console.log('tag, version, stage:', tag, version, stage);
  const params = createParams({
    tableName,
    tag,
    version,
    stage
  });
  return (0, _executeDynamodbOperation.execute)(docClient.put(params), {
    transformError
  });
};

exports.createUpsertTagCommand = createUpsertTagCommand;