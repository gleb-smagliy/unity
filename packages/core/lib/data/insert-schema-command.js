"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildInsertSchemaCommand = void 0;

var _operationResult = require("../common-modules/operation-result");

const buildInsertSchemaCommand = ({
  insertServices,
  insertMetadata
}) => async ({
  version,
  services,
  metadata
}) => {
  const result = await (0, _operationResult.composeResultsAsync)(insertServices({
    version,
    services
  }), insertMetadata({
    version,
    metadata
  }));

  if (!result.success) {
    return result;
  }

  return {
    success: true
  };
};

exports.buildInsertSchemaCommand = buildInsertSchemaCommand;