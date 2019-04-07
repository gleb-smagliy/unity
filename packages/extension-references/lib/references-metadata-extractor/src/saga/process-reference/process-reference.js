"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processReference = processReference;

var _sagaRunner = require("../../../../saga-runner");

var _getReferenceArguments = require("./get-reference-arguments");

var _getSourceKeys = require("./get-source-keys");

var _getSourceObject = require("./get-source-object");

var _getTargetKeys = require("./get-target-keys");

var _getAliasField = require("./get-alias-field");

function* processReference({
  reference,
  servicesHash
}) {
  const {
    typeName,
    fieldName,
    arguments: args
  } = reference;
  const schema = yield _sagaRunner.effects.call(servicesHash.getTransformedClientSchema);
  const {
    aliasName,
    query
  } = yield _sagaRunner.effects.call(_getReferenceArguments.getReferenceArguments, args);
  const {
    typeObject
  } = yield _sagaRunner.effects.call(_getSourceObject.getSourceObject, {
    schema,
    typeName
  });
  const targetKeysDefinition = yield _sagaRunner.effects.call(_getTargetKeys.getTargetKeys, {
    schema,
    query
  });
  const sourceKeysDefinition = yield _sagaRunner.effects.call(_getSourceKeys.getSourceKeys, {
    schema,
    typeObject,
    fieldName
  });
  const aliasField = yield _sagaRunner.effects.call(_getAliasField.getAliasField, {
    targetKeysDefinition,
    sourceKeysDefinition,
    aliasName,
    typeObject
  });
  const {
    keys: targetKeys
  } = targetKeysDefinition;
  const {
    keys: sourceKeys
  } = sourceKeysDefinition;
  return {
    success: true,
    payload: {
      sourceType: typeName,
      targetKeys,
      targetQuery: {
        name: query
      },
      sourceKeys,
      aliasField: {
        type: aliasField.type.toString(),
        name: aliasField.name
      }
    }
  };
}