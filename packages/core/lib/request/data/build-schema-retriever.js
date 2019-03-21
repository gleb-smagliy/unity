"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSchemaRetriever = void 0;

var _mapServices = require("./map-services");

const buildSchemaRetriever = options => {
  const {
    storage: {
      queries: {
        getSchemaByVersion
      }
    }
  } = options;
  return async ({
    version,
    args = {}
  }) => {
    const schemaResult = await getSchemaByVersion({
      version
    });

    if (!schemaResult.success) {
      return schemaResult;
    }

    const servicesResult = (0, _mapServices.mapServices)(schemaResult.payload.services, args);

    if (!servicesResult.success) {
      return servicesResult;
    }

    return {
      success: true,
      payload: {
        services: servicesResult.payload,
        pluginsMetadata: schemaResult.payload.pluginsMetadata
      }
    };
  };
};

exports.buildSchemaRetriever = buildSchemaRetriever;