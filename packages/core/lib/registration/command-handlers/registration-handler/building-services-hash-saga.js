"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildingServicesHashByTagSaga = buildingServicesHashByTagSaga;

var _data = require("../../../data");

var _sagaRunner = require("../../../common-modules/saga-runner");

var _services = require("../../modules/services");

function* buildingServicesHashByTagSaga({
  tag,
  upsert,
  transform,
  storage
}) {
  const getServicesByTag = (0, _data.buildServicesByTagQuery)(storage.queries);
  const {
    version,
    services
  } = yield _sagaRunner.effects.call(getServicesByTag, {
    tag
  });
  const servicesHash = yield _sagaRunner.effects.call(_services.buildServicesHash, {
    services,
    version,
    upsert,
    transform
  }); // servicesHash.setPluginsMetadata(servicesHash);

  return {
    success: true,
    payload: servicesHash
  };
}