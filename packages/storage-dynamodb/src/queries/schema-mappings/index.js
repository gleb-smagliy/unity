import { buildClientSchema } from 'graphql';

export const ITEM_TYPE = {
  PLUGIN_METADATA: 'PLUGIN_METADATA',
  SERVICE: 'SERVICE'
};

const pluginMetadataReducer = (result, item) =>
{
  if(item.SchemaItemType !== ITEM_TYPE.PLUGIN_METADATA)
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

const serviceMapper = item => ({
  id: item.ServiceId,
  schema: buildClientSchema(item.Schema),
  stage: item.Stage,
  metadata: item.Metadata,
  endpoint: item.Endpoint
});

export const toPluginsMetadata = (items = []) =>
{
 return items.reduce(pluginMetadataReducer, {});
};

export const toServices = items => items
  .filter(item => item.SchemaItemType === ITEM_TYPE.SERVICE)
  .map(serviceMapper);