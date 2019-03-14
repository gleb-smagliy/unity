"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertingServicesSaga = insertingServicesSaga;

var _sagaRunner = require("../../../common-modules/saga-runner");

function* insertingServicesSaga({
  storage,
  versioning,
  servicesHash,
  pluginsMetadata
}) {
  const {
    commands: {
      insertSchema
    }
  } = storage;
  const currentVersion = servicesHash.getVersion();
  const {
    version
  } = yield _sagaRunner.effects.call(versioning.createVersion, {
    currentVersion
  });
  yield _sagaRunner.effects.call(insertSchema, {
    version,
    services: servicesHash.getServicesList(),
    pluginsMetadata
  });
  return {
    success: true,
    payload: {
      version
    }
  };
}