"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSchemaBuilder = void 0;

var _getPluginName = require("./get-plugin-name");

const findSchemaBuilder = (builders, builderName) => {
  const schemaBuilder = builders.find(b => (0, _getPluginName.tryGetName)(b).payload === builderName);

  if (!schemaBuilder) {
    return {
      success: false,
      error: `Specified schema builder ${builderName} is not in options`
    };
  }

  return {
    success: true,
    payload: schemaBuilder
  };
};

exports.findSchemaBuilder = findSchemaBuilder;