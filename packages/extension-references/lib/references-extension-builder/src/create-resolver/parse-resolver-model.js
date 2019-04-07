"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseResolverModel = void 0;

const parseResolverModel = model => {
  if (typeof model.sourceKeys !== 'object' || !Array.isArray(model.sourceKeys)) {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.sourceKeys to be an array, but got: ${typeof model.sourceKeys}`
    };
  }

  if (typeof model.targetKeys !== 'object' || !Array.isArray(model.targetKeys)) {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.targetKeys to be an array, but got: ${typeof model.targetKeys}`
    };
  }

  if (model.targetKeys.length !== 1) {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Currently only arrays of length 1 for model.targetKeys supported, but got: ${JSON.stringify(model.targetKeys)}`
    };
  }

  if (model.sourceKeys.length !== 1) {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Currently only arrays of length 1 for model.sourceKeys supported, but got: ${JSON.stringify(model.sourceKeys)}`
    };
  }

  if (typeof model.targetKeys !== 'object') {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.sourceKeys to be an object, got: ${typeof model.sourceKeys}`
    };
  }

  if (typeof model.targetQuery !== 'object') {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.query to be an object, got: ${typeof model.targetQuery}`
    };
  }

  if (typeof model.targetQuery.name !== 'string') {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.targetQuery.name to be a string, got: ${typeof model.targetQuery.name}`
    };
  }

  if (typeof model.aliasField !== 'object' || typeof model.aliasField.name !== 'string') {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: expected name for model.aliasField, but model.aliasField is invalid: ${JSON.stringify(model.aliasField)}`
    };
  }

  const sourceKey = model.sourceKeys[0];
  const targetKey = model.targetKeys[0];
  const query = model.targetQuery.name;
  const resolverName = model.aliasField.name;
  return {
    success: true,
    payload: {
      resolverName,
      sourceKey,
      targetKey,
      query
    }
  };
};

exports.parseResolverModel = parseResolverModel;