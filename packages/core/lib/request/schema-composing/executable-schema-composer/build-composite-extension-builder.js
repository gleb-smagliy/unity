"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCompositeExtensionBuilder = void 0;

var _plugins = require("../../../common-modules/plugins");

const isValidTypeDef = t => typeof t === 'string' && t !== null && t.trim().length > 0;

const isValidResolver = r => typeof r === 'object' && r !== null;

const buildCompositeExtensionBuilder = extensionBuilders => {
  return ({
    metadata
  }) => {
    const typeDefs = [];
    const resolvers = [];

    for (let builder of extensionBuilders) {
      const getNameResult = (0, _plugins.tryGetName)(builder);
      if (!getNameResult.success) return getNameResult;
      const getBuilderMetadataResult = (0, _plugins.tryGetPluginMetadata)(metadata, getNameResult.payload);
      if (!getBuilderMetadataResult.success) return getBuilderMetadataResult;
      const buildResult = builder.buildSchemaExtensions({
        model: getBuilderMetadataResult.payload
      });
      if (!buildResult.success) return buildResult;

      if (Array.isArray(buildResult.payload.typeDefs)) {
        typeDefs.push(...buildResult.payload.typeDefs.filter(isValidTypeDef));
      } else if (isValidTypeDef(buildResult.payload.typeDefs)) {
        typeDefs.push(buildResult.payload.typeDefs);
      }

      if (Array.isArray(buildResult.payload.resolvers)) {
        resolvers.push(...buildResult.payload.resolvers.filter(isValidResolver));
      } else if (isValidResolver(buildResult.payload.resolvers)) {
        resolvers.push(buildResult.payload.resolvers);
      }
    }

    return {
      success: true,
      payload: {
        typeDefs,
        resolvers
      }
    };
  };
};

exports.buildCompositeExtensionBuilder = buildCompositeExtensionBuilder;