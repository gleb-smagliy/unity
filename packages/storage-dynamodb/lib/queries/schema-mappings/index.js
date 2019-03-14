"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toServices = exports.toPluginsMetadata = exports.ITEM_TYPE = void 0;

var _fakeTables = require("../../../__tests__/fake-tables");

const ITEM_TYPE = {
  PLUGIN_METADATA: 'PLUGIN_METADATA',
  SERVICE: 'SERVICE'
};
exports.ITEM_TYPE = ITEM_TYPE;

const pluginMetadataReducer = (result, item) => {
  if (item.Type !== ITEM_TYPE.PLUGIN_METADATA) {
    return result;
  }

  const metadata = {
    pluginName: item.PluginName,
    metadata: item.Metadata
  };
  result[metadata.pluginName] = metadata;
  return result;
};

const serviceMapper = item => ({
  id: item.ServiceId,
  schema: item.Schema,
  stage: item.Stage,
  metadata: item.Metadata,
  endpoint: item.Endpoint
});

const toPluginsMetadata = items => items.reduce(pluginMetadataReducer, {});

exports.toPluginsMetadata = toPluginsMetadata;

const toServices = items => items.filter(item => item.Type === ITEM_TYPE.SERVICE).map(serviceMapper);

exports.toServices = toServices;