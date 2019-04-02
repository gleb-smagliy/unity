"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferencesExtensionBuilder = void 0;

var _referencesMetadataExtractor = require("../../references-metadata-extractor");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const METADATA_NAME = 'ref';

class ReferencesExtensionBuilder {
  constructor({
    metadataName = METADATA_NAME
  } = {}) {
    _defineProperty(this, "name", 'ReferencesExtensionBuilder');

    _defineProperty(this, "getMetadataExtractor", () => {
      return new _referencesMetadataExtractor.ReferencesMetadataExtractor({
        metadataName: this.metadataName
      });
    });

    _defineProperty(this, "buildSchemaExtensions", ({
      model
    }) => {
      return {
        success: true,
        payload: {
          typeDefs: ``,
          resolvers: {
            Query: () => ({})
          }
        }
      };
    });

    this.metadataName = metadataName;
  }

}

exports.ReferencesExtensionBuilder = ReferencesExtensionBuilder;