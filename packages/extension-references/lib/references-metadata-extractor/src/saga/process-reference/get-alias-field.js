"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAliasField = getAliasField;

var _graphql = require("graphql");

const buildAliasType = (sourceKeyType, returnType) => {
  const nullableSourceType = (0, _graphql.getNullableType)(sourceKeyType);
  const nullableTargetType = (0, _graphql.getNullableType)(returnType);
  const isTargetNullable = (0, _graphql.isNullableType)(returnType);
  let aliasType = (0, _graphql.isListType)(nullableTargetType) ? nullableTargetType.ofType : nullableTargetType;
  aliasType = (0, _graphql.isListType)(nullableSourceType) ? (0, _graphql.GraphQLList)(aliasType) : aliasType;
  aliasType = isTargetNullable ? aliasType : (0, _graphql.GraphQLNonNull)(aliasType);
  return aliasType;
};

function* getAliasField({
  targetKeysDefinition,
  sourceKeysDefinition,
  aliasName,
  typeObject
}) {
  const {
    targetKeySubtype,
    returnType
  } = targetKeysDefinition;
  const {
    keys: sourceKeys,
    sourceKeySubtype,
    sourceKeyType
  } = sourceKeysDefinition;

  if (targetKeySubtype.toString() !== sourceKeySubtype.toString()) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: target key type ${targetKeySubtype} does not match source key type ${sourceKeySubtype} on ${typeObject.name}:${sourceKeys[0].name}`
    };
  }

  if (typeObject.getFields()[aliasName]) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: type ${typeObject.name} already has ${aliasName} field`
    };
  }

  return {
    success: true,
    payload: {
      name: aliasName,
      type: buildAliasType(sourceKeyType, returnType)
    }
  };
}