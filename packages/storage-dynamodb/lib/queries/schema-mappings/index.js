"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toServices = exports.toPluginsMetadata = exports.ITEM_TYPE = void 0;

var _graphql = require("graphql");

const ITEM_TYPE = {
  PLUGIN_METADATA: 'PLUGIN_METADATA',
  SERVICE: 'SERVICE'
};
exports.ITEM_TYPE = ITEM_TYPE;

const pluginMetadataReducer = (result, item) => {
  if (item.SchemaItemType !== ITEM_TYPE.PLUGIN_METADATA) {
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
  schema: (0, _graphql.buildClientSchema)(item.Schema),
  args: item.Args,
  metadata: item.Metadata || [],
  endpoint: item.Endpoint
});

const toPluginsMetadata = (items = []) => {
  return items.reduce(pluginMetadataReducer, {});
};

exports.toPluginsMetadata = toPluginsMetadata;

const toServices = items => items.filter(item => item.SchemaItemType === ITEM_TYPE.SERVICE).map(serviceMapper);

exports.toServices = toServices;