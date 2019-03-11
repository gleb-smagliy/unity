"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformServices = void 0;

var _graphqlTools = require("graphql-tools");

var _buildCompositeServiceTransformer = require("../../../request/schema-composing/executable-schema-composer/build-composite-service-transformer");

const transformServices = transformers => servicesHash => {
  const compositeTransformer = (0, _buildCompositeServiceTransformer.buildCompositeServicesTransformer)(transformers);
  const transformsResult = compositeTransformer({
    services: Object.values(servicesHash)
  });

  if (!transformsResult.success) {
    return transformsResult;
  }

  const result = {};

  for (let key of Object.keys(servicesHash)) {
    const service = servicesHash[key];
    result[key] = { ...service,
      transformedSchema: (0, _graphqlTools.transformSchema)(service.schema, transformsResult.payload[key])
    };
  }

  console.log('result:', result);
  return {
    success: true,
    payload: result
  };
};

exports.transformServices = transformServices;