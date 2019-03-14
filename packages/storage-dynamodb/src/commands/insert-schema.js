import { ITEM_TYPE } from '../queries/schema-mappings';
import { execute } from '../execute-dynamodb-operation';

const toPutRequest = item => ({
  PutRequest: { Item: item }
});

const toServiceItem = (version, service) =>
{
  const serviceId = service.id;
  const stage = service.stage || null;

  return {
    Version: version,
    Id: `${ITEM_TYPE.SERVICE}/${serviceId}`,
    Type: ITEM_TYPE.SERVICE,
    ServiceId: serviceId,
    Schema: service.schema,
    Metadata: service.metadata,
    Endpoint: service.endpoint,
    Stage: stage
  };
};

const toPluginMetadataItem = (version, pluginMetadata) =>
{
  const pluginName = pluginMetadata.pluginName;

  return {
    Version: version,
    Id: `${ITEM_TYPE.PLUGIN_METADATA}/${pluginName}`,
    Type: ITEM_TYPE.PLUGIN_METADATA,
    PluginName: pluginName,
    Metadata: pluginMetadata.metadata
  };
};

const putServices = (version, services) =>
  services.map(service => toPutRequest(toServiceItem(version, service)));

const putPluginsMetadata = (version, pluginsMetadata) =>
  Object.values(pluginsMetadata).map(pluginMetadata => toPutRequest(toPluginMetadataItem(version, pluginMetadata)));

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