"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTargetKeys = getTargetKeys;

var _graphql = require("graphql");

var _getSubType = require("./get-sub-type");

function* getTargetKeys({
  schema,
  query
}) {
  const queryType = schema.getQueryType();

  if (typeof queryType !== 'object' || queryType === null) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: expected schema to contain query`
    };
  }

  const targetQueryType = queryType.getFields()[query];

  if (typeof targetQueryType !== 'object' || targetQueryType === null) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: expected schema to contain ${query} query`
    };
  }

  const queryArgs = targetQueryType.args;

  if (queryArgs.length !== 1) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: expected query ${query} to have exactly 1 argument`
    };
  }

  const key = queryArgs[0];
  const keyName = key.name;
  const keyType = key.type;

  if (!(0, _graphql.isListType)((0, _graphql.getNullableType)(keyType))) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: expected query ${query} to accept list as a first argument, instead got: ${keyType}.
        This could lead to N + 1 issue.
      `
    };
  }

  const keySubType = (0, _getSubType.getSubType)(key.type);
  return {
    success: true,
    payload: {
      keys: [keyName],
      targetKeySubtype: keySubType,
      targetKeyType: keyType,
      returnType: targetQueryType.type
    }
  };
}