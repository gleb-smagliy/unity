"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSchemaRetriever = void 0;

const buildSchemaRetriever = options => {
  const {
    storage: {
      queries: {
        getSchemaByVersion
      }
    }
  } = options;
  return async ({
    version
  }) => {
    const schemaResult = await getSchemaByVersion({
      version
    });

    if (!schemaResult.success) {
      return schemaResult;
    }

    return {
      success: true,
      payload: {
        services: schemaResult.payload.services,
        pluginsMetadata: schemaResult.payload.pluginsMetadata
      }
    };
  };
};

exports.buildSchemaRetriever = buildSchemaRetriever;