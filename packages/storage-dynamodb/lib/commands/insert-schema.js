"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInsertSchemaCommand = void 0;

var _schemaMappings = require("../queries/schema-mappings");

var _executeDynamodbOperation = require("../execute-dynamodb-operation");

var _graphql = require("graphql");

const toPutRequest = item => ({
  PutRequest: {
    Item: item
  }
});

const toServiceItem = (version, service) => {
  const serviceId = service.id;
  const args = service.args || {};
  const ret = {
    Version: version,
    Id: `${_schemaMappings.ITEM_TYPE.SERVICE}/${serviceId}`,
    SchemaItemType: _schemaMappings.ITEM_TYPE.SERVICE,
    ServiceId: serviceId,
    Schema: JSON.stringify((0, _graphql.introspectionFromSchema)(service.schema)),
    Metadata: service.metadata,
    Endpoint: service.endpoint,
    Args: args
  };
  return ret;
};

const toPluginMetadataItem = (pluginName, version, pluginMetadata) => {
  return {
    Version: version,
    Id: `${_schemaMappings.ITEM_TYPE.PLUGIN_METADATA}/${pluginName}`,
    SchemaItemType: _schemaMappings.ITEM_TYPE.PLUGIN_METADATA,
    PluginName: pluginName,
    Metadata: pluginMetadata
  };
};

const putServices = (version, services) => services.map(service => toPutRequest(toServiceItem(version, service)));

const putPluginsMetadata = (version, pluginsMetadata) => Object.keys(pluginsMetadata).map(key => toPutRequest(toPluginMetadataItem(key, version, pluginsMetadata[key])));

const createParams = ({
  tableName,
  version,
  services,
  pluginsMetadata
}) => ({
  RequestItems: {
    [tableName]: [...putServices(version, services), ...putPluginsMetadata(version, pluginsMetadata)]
  }
});

const transformError = error => `InsertSchemaCommand::${error.message}`;

const createInsertSchemaCommand = ({
  docClient,
  tableName
}) => async ({
  version,
  services,
  pluginsMetadata
}) => {
  const params = createParams({
    tableName,
    version,
    services,
    pluginsMetadata
  });
  return (0, _executeDynamodbOperation.execute)(docClient.batchWrite(params), {
    transformError
  });
};

exports.createInsertSchemaCommand = createInsertSchemaCommand;