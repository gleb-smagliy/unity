"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryGetPluginMetadata = void 0;

const tryGetPluginMetadata = (metadata, pluginName) => {
  const pluginMetadata = metadata[pluginName];

  if (typeof pluginMetadata !== 'object') {
    return {
      success: false,
      error: `Plugin <${pluginName}> metadata is not an object, it is: ${pluginMetadata}`
    };
  }

  return {
    success: true,
    payload: pluginMetadata
  };
};

exports.tryGetPluginMetadata = tryGetPluginMetadata;