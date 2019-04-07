"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferencesExtensionBuilder = void 0;

var _referencesMetadataExtractor = require("../../references-metadata-extractor");

var _createResolver = require("./create-resolver");

var _createTypeDefs = require("./create-type-defs");

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
      const buildResolvers = (0, _createResolver.createResolver)(model);

      if (!buildResolvers.success) {
        return buildResolvers;
      }

      const buildTypeDefs = (0, _createTypeDefs.createTypeDefs)(model);

      if (!buildTypeDefs.success) {
        return buildTypeDefs;
      }

      return {
        success: true,
        payload: {
          typeDefs: buildTypeDefs.payload,
          resolvers: buildResolvers.payload
        }
      };
    });

    this.metadataName = metadataName;
  }

}

exports.ReferencesExtensionBuilder = ReferencesExtensionBuilder;