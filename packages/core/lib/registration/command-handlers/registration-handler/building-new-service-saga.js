"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildingNewServiceSaga = buildingNewServiceSaga;

var _sagaRunner = require("../../../common-modules/saga-runner");

var _plugins = require("../../../common-modules/plugins");

var _services = require("../../../common-modules/services");

function* buildingNewServiceSaga({
  serviceDefinition,
  schemaBuilders,
  schemaBuilderName
}) {
  const endpoint = yield _sagaRunner.effects.call(_services.buildUri, serviceDefinition.endpoint, serviceDefinition.args);
  const schemaBuilderInput = { ...serviceDefinition,
    endpoint,
    args: undefined
  };
  const schemaBuilder = yield _sagaRunner.effects.call(_plugins.findSchemaBuilder, schemaBuilders, schemaBuilderName);
  const builtService = yield _sagaRunner.effects.call(schemaBuilder.buildServiceModel, schemaBuilderInput);
  const serviceMetadata = yield _sagaRunner.effects.call(schemaBuilder.extractMetadata, schemaBuilderInput);
  return {
    success: true,
    payload: {
      schema: builtService.schema,
      metadata: serviceMetadata.metadata,
      id: serviceDefinition.id,
      endpoint: serviceDefinition.endpoint,
      args: serviceDefinition.args,
      headers: serviceDefinition.headers
    }
  };
}