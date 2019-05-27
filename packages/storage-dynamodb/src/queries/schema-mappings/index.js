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

  const pluginName = item.PluginName;
  const metadata = item.Metadata;

  if(!result[pluginName])
  {
    result[pluginName] = [];
  }

  if(Array.isArray(metadata))
  {
    result[pluginName].push(...metadata);
  }
  else
  {
    result[pluginName].push(metadata);
  }

  return result;
};

const serviceMapper = item => ({
  id: item.ServiceId,
  schema: buildClientSchema(JSON.parse(item.Schema)),
  args: item.Args,
  metadata: item.Metadata || [],
  endpoint: item.Endpoint
});

export const toPluginsMetadata = (items = []) =>
{
 return items.reduce(pluginMetadataReducer, {});
};

export const toServices = items => items
  .filter(item => item.SchemaItemType === ITEM_TYPE.SERVICE)
  .map(serviceMapper);