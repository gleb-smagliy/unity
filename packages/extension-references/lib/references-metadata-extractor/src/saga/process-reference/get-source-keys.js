"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceKeys = getSourceKeys;

var _getSubType = require("./get-sub-type");

function* getSourceKeys({
  schema,
  typeObject,
  fieldName
}) {
  const sourceField = typeObject.getFields()[fieldName];

  if (typeof sourceField !== 'object' || sourceField === null) {
    return {
      success: false,
      error: `ExtractReferenceMetadata: source field ${fieldName} is not present on ${typeObject}`
    };
  }

  const keyName = sourceField.name;
  const keyType = sourceField.type;
  const keySubType = (0, _getSubType.getSubType)(keyType);
  return {
    success: true,
    payload: {
      keys: [keyName],
      sourceKeySubtype: keySubType,
      sourceKeyType: keyType
    }
  };
}