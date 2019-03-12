"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareOptions = void 0;
const DEFAULT_OPTIONS = {
  serviceSchemaTransformers: [],
  gatewaySchemaTransformers: [],
  extensionBuilders: []
}; //todo: currently just a stub

const prepareOptions = options => {
  if (typeof options !== 'object' || options === null) {
    return {
      success: false,
      error: 'Expected options to be a non-null object'
    };
  }

  return {
    success: true,
    payload: { ...DEFAULT_OPTIONS,
      ...options
    }
  };
};

exports.prepareOptions = prepareOptions;