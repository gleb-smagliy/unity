"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCompositeServicesTransformer = void 0;

var _plugins = require("../../../common-modules/plugins");

const buildCompositeServicesTransformer = transformers => {
  return ({
    services,
    metadata
  }) => {
    const transforms = {}; // todo: O(n * m) - could we do something to achieve lower complexity?

    for (let transformer of transformers) {
      for (let service of services) {
        const getNameResult = (0, _plugins.tryGetName)(transformer);
        if (!getNameResult.success) return getNameResult;
        const getTransformsResult = transformer.getTransforms({
          service: {
            id: service.id,
            schema: service.schema
          }
        });
        if (!getTransformsResult.success) return getTransformsResult;

        if (!transforms[service.id]) {
          transforms[service.id] = [];
        }

        if (Array.isArray(getTransformsResult.payload)) {
          transforms[service.id].push(...getTransformsResult.payload.filter(_plugins.isValidTransform));
        } else if ((0, _plugins.isValidTransform)(getTransformsResult.payload)) {
          transforms[service.id].push(getTransformsResult.payload);
        }
      }
    }

    return {
      success: true,
      payload: transforms
    };
  };
};

exports.buildCompositeServicesTransformer = buildCompositeServicesTransformer;