"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildExecutableSchemaQuery = void 0;

var _options = require("../common-modules/options");

var _getSchemaVersion = require("./data/get-schema-version");

var _schemaComposing = require("./schema-composing");

var _middleware = require("../middleware");

var _tracing = require("../tracing");

const buildExecutableSchemaQuery = options => {
  const optionsPreparation = (0, _options.prepareOptions)(options);

  if (!optionsPreparation.success) {
    throw new Error(`Options is not valid: <${optionsPreparation.error}>`);
  }

  const composeSchema = (0, _schemaComposing.buildSchemaComposer)(optionsPreparation.payload);
  return async ({
    version,
    tag
  }) => {
    const {
      getVersionByTag
    } = options.storage.queries;
    const schemaVersionResult = await (0, _getSchemaVersion.getSchemaVersion)({
      version,
      tag,
      getVersionByTag
    });

    if (!schemaVersionResult.success) {
      throw new Error(schemaVersionResult.error);
    }

    const {
      args,
      version: resultVersion
    } = schemaVersionResult.payload;
    const result = await composeSchema({
      version: resultVersion,
      args
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    (0, _tracing.getLogger)().info('Schema for ({tag}, {version}) loaded', {
      tag,
      version: resultVersion
    });
    (0, _middleware.applyTracingToSchema)(result.payload);
    return result.payload;
  };
};

exports.buildExecutableSchemaQuery = buildExecutableSchemaQuery;