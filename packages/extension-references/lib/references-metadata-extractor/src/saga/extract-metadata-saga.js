"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractMetadataSaga = extractMetadataSaga;

var _sagaRunner = require("../../../saga-runner");

var _processReference = require("./process-reference");

function* extractMetadataSaga({
  servicesHash,
  metadataName
}) {
  const references = yield _sagaRunner.effects.call(servicesHash.getMetadata, {
    name: metadataName
  });
  const referenceMetadataModels = [];

  for (let reference of references) {
    const referenceMetadataModel = yield _sagaRunner.effects.call(_processReference.processReference, {
      reference,
      servicesHash
    });
    referenceMetadataModels.push(referenceMetadataModel);
  }

  return {
    success: true,
    payload: referenceMetadataModels
  };
}