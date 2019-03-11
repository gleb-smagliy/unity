"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrationSaga = registrationSaga;

var _sagaRunner = require("../../../common-modules/saga-runner");

var _buildingNewServiceSaga = require("./building-new-service-saga");

var _buildingServicesHashSaga = require("./building-services-hash-saga");

var _services = require("../../modules/services");

var _insertingServicesSaga = require("./inserting-services-saga");

var _systemTags = require("./system-tags");

function* registrationSaga({
  command,
  options: configOptions,
  extractPluginsMetadata
}) {
  const {
    schemaBuilders,
    versioning,
    serviceSchemaTransformers,
    storage
  } = configOptions;
  const {
    id: serviceId,
    schemaBuilder: schemaBuilderName,
    options: builderOptions
  } = command;
  const serviceDefinition = {
    id: serviceId,
    options: builderOptions
  };
  const upsert = yield _sagaRunner.effects.call(_buildingNewServiceSaga.buildingNewServiceSaga, {
    serviceDefinition,
    schemaBuilders,
    schemaBuilderName
  });
  const transform = yield _sagaRunner.effects.call(_services.transformServices, serviceSchemaTransformers);
  const servicesHash = yield _sagaRunner.effects.call(_buildingServicesHashSaga.buildingServicesHashByTagSaga, {
    tag: _systemTags.SYSTEM_TAGS.STABLE,
    upsert,
    transform,
    storage
  });
  const pluginsMetadata = yield _sagaRunner.effects.call(extractPluginsMetadata, servicesHash);
  const {
    version: newVersion
  } = yield _sagaRunner.effects.call(_insertingServicesSaga.insertingServicesSaga, {
    storage,
    versioning,
    servicesHash,
    pluginsMetadata
  });
  return {
    success: true,
    payload: {
      version: newVersion
    }
  };
}