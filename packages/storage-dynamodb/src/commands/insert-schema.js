import { ITEM_TYPE } from '../queries/schema-mappings';
import { execute } from '../execute-dynamodb-operation';
import { introspectionFromSchema } from 'graphql';

const toPutRequest = item => ({
  PutRequest: { Item: item }
});

const toServiceItem = (version, service) =>
{
  const serviceId = service.id;
  const args = service.args || {};

  return {
    Version: version,
    Id: `${ITEM_TYPE.SERVICE}/${serviceId}`,
    SchemaItemType: ITEM_TYPE.SERVICE,
    RequestHeaders: service.headers,
    ServiceId: serviceId,
    Schema: JSON.stringify(introspectionFromSchema(service.schema)),
    Metadata: service.metadata,
    Endpoint: service.endpoint,
    Args: args
  };
};

const toPluginMetadataItem = (pluginName, version, pluginMetadata) =>
{
  return {
    Version: version,
    Id: `${ITEM_TYPE.PLUGIN_METADATA}/${pluginName}`,
    SchemaItemType: ITEM_TYPE.PLUGIN_METADATA,
    PluginName: pluginName,
    Metadata: pluginMetadata
  };
};

const putServices = (version, services) =>
  services.map(service => toPutRequest(toServiceItem(version, service)));

const putPluginsMetadata = (version, pluginsMetadata) =>
  Object.keys(pluginsMetadata).map(key => toPutRequest(toPluginMetadataItem(key, version, pluginsMetadata[key])));

const createParams = ({ tableName, version, services, pluginsMetadata }) => ({
  RequestItems: {
    [tableName]: [
      ...putServices(version, services),
      ...putPluginsMetadata(version, pluginsMetadata)
    ]
  }
});

const transformError = error => `InsertSchemaCommand::${error.message}`;

export const createInsertSchemaCommand = ({ docClient, tableName }) => async ({
  version,
  services,
  pluginsMetadata
}) =>
{
  const params = createParams({ tableName, version, services, pluginsMetadata });

  return execute(docClient.batchWrite(params), { transformError });
};