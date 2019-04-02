"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferencesMetadataExtractor = void 0;

var _saga = require("./saga");

var _sagaRunner = require("../../saga-runner");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReferencesMetadataExtractor {
  constructor({
    metadataName
  }) {
    _defineProperty(this, "extractMetadata", async ({
      servicesHash
    }) => {
      const saga = (0, _saga.extractMetadataSaga)({
        servicesHash,
        metadataName: this.metadataName
      });
      return await (0, _sagaRunner.runSaga)(saga);
    });

    this.metadataName = metadataName;
  }

}

exports.ReferencesMetadataExtractor = ReferencesMetadataExtractor;