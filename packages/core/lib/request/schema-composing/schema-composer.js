"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSchemaComposer = void 0;

var _data = require("../data");

var _executableSchemaComposer = require("./executable-schema-composer");

const buildSchemaComposer = options => {
  const schemaRetriever = (0, _data.buildSchemaRetriever)(options);
  const composeExecutableSchema = (0, _executableSchemaComposer.buildExecutableSchemaComposer)(options);
  return async ({
    version
  }) => {
    const schemasRetrieval = await schemaRetriever({
      version
    });
    if (!schemasRetrieval.success) return schemasRetrieval;
    return composeExecutableSchema(schemasRetrieval.payload);
  };
};

exports.buildSchemaComposer = buildSchemaComposer;