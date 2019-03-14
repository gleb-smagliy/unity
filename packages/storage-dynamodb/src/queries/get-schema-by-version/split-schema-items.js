const ITEM_TYPE = {
  PLUGIN_METADATA: 'PLUGIN_METADATA',
  SERVICE: 'SERVICE'
};

const pluginMetadataReducer = (result, item) =>
{
  if(item.Type !== ITEM_TYPE.PLUGIN_METADATA)
  {
    return result;
  }

  const metadata =
  {
    pluginName: item.PluginName,
    metadata: item.Metadata
  };

  result[metadata.pluginName] = metadata;

  return result;
};

const toPluginsMetadata = items => items.reduce(pluginMetadataReducer, {});

const serviceMapper = item => ({
  id: item.ServiceId,
  schema: item.Schema,
  metadata: item.Metadata
});

const toServices = items => items
  .filter(item => item.Type === ITEM_TYPE.SERVICE)
  .map(serviceMapper);

export const splitSchemaItems = items => ({
  metadata: toPluginsMetadata(items),
  services: toServices(items)
});