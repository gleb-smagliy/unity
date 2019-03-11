"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildingNewServiceSaga = buildingNewServiceSaga;

var _sagaRunner = require("../../../common-modules/saga-runner");

var _plugins = require("../../../common-modules/plugins");

function* buildingNewServiceSaga({
  serviceDefinition,
  schemaBuilders,
  schemaBuilderName
}) {
  const schemaBuilder = yield _sagaRunner.effects.call(_plugins.findSchemaBuilder, schemaBuilders, schemaBuilderName);
  const builtService = yield _sagaRunner.effects.call(schemaBuilder.buildServiceModel, serviceDefinition);
  const serviceMetadata = yield _sagaRunner.effects.call(schemaBuilder.extractMetadata, serviceDefinition);
  return {
    success: true,
    payload: {
      schema: builtService.schema,
      metadata: serviceMetadata.metadata,
      id: serviceDefinition.id
    }
  };
}