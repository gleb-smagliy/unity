"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertingServicesSaga = insertingServicesSaga;

var _sagaRunner = require("../../../common-modules/saga-runner");

var _data = require("../../../data");

function* insertingServicesSaga({
  storage,
  versioning,
  servicesHash,
  pluginsMetadata
}) {
  const currentVersion = servicesHash.getVersion();
  const insertSchema = yield _sagaRunner.effects.call(_data.buildInsertSchemaCommand, storage.commands);
  const {
    version
  } = yield _sagaRunner.effects.call(versioning.createVersion, {
    currentVersion
  });
  yield _sagaRunner.effects.call(insertSchema, {
    version,
    services: servicesHash.getServicesList(),
    metadata: pluginsMetadata
  });
  return {
    success: true,
    payload: {
      version
    }
  };
}