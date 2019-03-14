"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCompositeGatewayTransformer = void 0;

var _plugins = require("../../../common-modules/plugins");

const buildCompositeGatewayTransformer = transformers => {
  return ({
    pluginsMetadata
  }) => {
    const transforms = [];

    for (let transformer of transformers) {
      const getNameResult = (0, _plugins.tryGetName)(transformer);
      if (!getNameResult.success) return getNameResult;
      const getTransformerMetadataResult = (0, _plugins.tryGetPluginMetadata)(pluginsMetadata, getNameResult.payload);
      if (!getTransformerMetadataResult.success) return getTransformerMetadataResult;
      const getTransformsResult = transformer.getTransforms({
        model: getTransformerMetadataResult.payload
      });
      if (!getTransformsResult.success) return getTransformsResult;

      if (Array.isArray(getTransformsResult.payload)) {
        transforms.push(...getTransformsResult.payload);
      } else {
        transforms.push(getTransformsResult.payload);
      }
    }

    return {
      success: true,
      payload: transforms.filter(_plugins.isValidTransform)
    };
  };
};

exports.buildCompositeGatewayTransformer = buildCompositeGatewayTransformer;