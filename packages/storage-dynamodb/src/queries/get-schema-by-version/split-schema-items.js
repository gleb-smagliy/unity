const ITEM_TYPE = {
  PLUGIN_METADATA: 'PLUGIN_METADATA',
  SERVICE: 'SERVICE'
};

const toPluginsMetadata = (items) =>
{
  items
    .filter(item => item.Type === ITEM_TYPE.PLUGIN_METADATA)
    .reduce((result, item) =>
    {
      result[item.PluginName] =
    }, {});
};

export const splitSchemaItems = items => ({
  metadata: toPluginsMetadata(items),
  services: toServices(items)
});