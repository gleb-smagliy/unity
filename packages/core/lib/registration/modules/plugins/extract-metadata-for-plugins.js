"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractMetadataForPlugins = void 0;

var _plugins = require("../../../common-modules/plugins");

const extractMetadataForPlugins = async ({
  plugins,
  args
}) => {
  const metadata = {};

  for (let plugin of plugins) {
    const name = (0, _plugins.tryGetName)(plugin).payload;
    const extractor = plugin.getMetadataExtractor();
    const extractMetadataResult = await extractor.extractMetadata(...args);

    if (!extractMetadataResult.success) {
      return extractMetadataResult;
    }

    metadata[name] = extractMetadataResult.payload;
  }

  return {
    success: true,
    payload: metadata
  };
};

exports.extractMetadataForPlugins = extractMetadataForPlugins;