import { buildClientSchema } from 'graphql';
import { createInsertSchemaCommand } from "../../src/commands";
import { createSuccessfulBatchWriteClient, createFailedBatchWriteClient } from '../fake-dynamodb-client';
import { SERVICE } from "../fake-tables";
import { introspectionFromSchema } from 'graphql';

const tableName = 'test.Schema';

const runCommand = async ({ docClient, payload }) =>
{
  const command = createInsertSchemaCommand({ docClient, tableName });

  return await command(payload);
};

const putRequest = (...items) => items.map(item => ({
  PutRequest: { Item: item }
}));

const createPayload = ({ args } = {}) => ({
  version: 'some_version',
  services: [{
    id: 'User',
    schema: buildClientSchema(SERVICE.Schema),
    metadata: [{ dummy: 321 }],
    args,
    endpoint: 'localhost'
  }],
  pluginsMetadata: {
    'extension_builder': { testKey1: 'test_value_1' },
    'schema_transformer': { testKey2: 'test_value_2' }
  }
});

const createPutRequests = ({ args }) => ({
  SERVICE: {
    Version: 'some_version',
    Id: 'SERVICE/User',
    SchemaItemType: 'SERVICE',
    ServiceId: 'User',
    Schema: introspectionFromSchema(buildClientSchema(SERVICE.Schema)),
    Metadata: [{ dummy: 321 }],
    Endpoint: 'localhost',
    Args: args
  },
  METADATA1: {
    Version: 'some_version',
    Id: 'PLUGIN_METADATA/extension_builder',
    SchemaItemType: 'PLUGIN_METADATA',
    PluginName: 'extension_builder',
    Metadata: { testKey1: 'test_value_1' }
  },
  METADATA2: {
    Version: 'some_version',
    Id: 'PLUGIN_METADATA/schema_transformer',
    SchemaItemType: 'PLUGIN_METADATA',
    PluginName: 'schema_transformer',
    Metadata: { testKey2: 'test_value_2' }
  }
});

describe('insertSchema command', () =>
{
  it('should return success if dynamodb batchWrite resolves successfully', async () =>
  {
    const docClient = createSuccessfulBatchWriteClient();
    const result = await runCommand({ docClient, payload: createPayload() });

    expect(result).toBeSuccessful();
  });

  it('should call batchWrite with right params', async () =>
  {
    const args = { argKey1: 'arg1_value' };

    const docClient = createSuccessfulBatchWriteClient();
    await runCommand({ docClient, payload: createPayload({ args }) });

    const PUT_REQUESTS = createPutRequests({ args });

    expect(docClient.batchWrite).toHaveBeenCalledWith({
      RequestItems: {
        [tableName]: putRequest(PUT_REQUESTS.SERVICE, PUT_REQUESTS.METADATA1, PUT_REQUESTS.METADATA2)
      }
    });
  });

  it('should call batchWrite with right params replaces service args with empty array if it is undefined', async () =>
  {
    const docClient = createSuccessfulBatchWriteClient();
    await runCommand({ docClient, payload: createPayload() });

    const PUT_REQUESTS = createPutRequests({ args: {} });

    expect(docClient.batchWrite).toHaveBeenCalledWith({
      RequestItems: {
        [tableName]: putRequest(PUT_REQUESTS.SERVICE, PUT_REQUESTS.METADATA1, PUT_REQUESTS.METADATA2)
      }
    });
  });

  it('should return failure if dynamodb batchWrite rejects', async () =>
  {
    const docClient = createFailedBatchWriteClient();
    const result = await runCommand({ docClient, payload: createPayload() });

    expect(result).toBeFailed();
  });
});