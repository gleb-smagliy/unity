"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSchemaRetriever = void 0;

const handleResults = results => {
  const [servicesResult, metadataResult] = results;

  if (!servicesResult.success) {
    return {
      success: false,
      error: servicesResult.error
    };
  }

  if (!metadataResult.success) {
    return {
      success: false,
      error: metadataResult.error
    };
  }

  return {
    success: true,
    payload: {
      services: servicesResult.payload,
      metadata: metadataResult.payload
    }
  };
};

const buildSchemaRetriever = options => {
  const {
    storage: {
      queries: {
        getServicesByVersion,
        getMetadataByVersion
      }
    }
  } = options;
  return async ({
    version
  }) => {
    const servicesPromise = getServicesByVersion({
      version
    });
    const metadataPromise = getMetadataByVersion({
      version
    });
    const promises = Promise.all([servicesPromise, metadataPromise]);
    return promises.then(handleResults);
  };
};

exports.buildSchemaRetriever = buildSchemaRetriever;