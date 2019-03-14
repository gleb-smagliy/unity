import { createInsertSchemaCommand } from "../../src/commands";
import { createFailedPutClient, createSuccessfulPutClient } from '../fake-dynamodb-client';

const tableName = 'test.Schema';

const runCommand = async ({ docClient, payload }) =>
{
  const command = createInsertSchemaCommand({ docClient, tableName });

  return await command(payload);
};

const payload = {
  version: 'some_version',
  services: [{
    id: 'User',
    schema: { dummy: 123 },
    metadata: [{ dummy: 321 }],
    stage: 'test',
    endpoint: 'localhost'
  }],
  pluginsMetadata: {
    'extension_builder': {
      pluginName: 'extension_builder',
      metadata: { testKey1: 'test_value_1' }
    },
    'schema_transformer': {
      pluginName: 'schema_transformer',
      metadata: { testKey2: 'test_value_2' }
    },
  }
};

const PUT_REQUESTS = {
  SERVICE: {
    Version: 'some_version',
    Id: 'SERVICE/User',
    Type: 'Service',
    ServiceId: 'User',
    Schema: { dummy: 123 },
    Metadata: [{ dummy: 321 }],
    Endpoint: 'localhost',
    Stage: 'test'
  },
  METADATA1: {
    Version: 'some_version',
    Id: 'PLUGIN_METADATA/extension_builder',
    Type: 'PLUGIN_METADATA',
    PluginName: 'extension_builder',
    Metadata: { testKey1: 'test_value_1' }
  },
  METADATA2: {
    Version: 'some_version',
    Id: 'PLUGIN_METADATA/schema_transformer',
    Type: 'PLUGIN_METADATA',
    PluginName: 'schema_transformer',
    Metadata: { testKey2: 'test_value_2' }
  }
};

describe('insertSchema command', () =>
{
  it('should return success if dynamodb batchWrite resolves successfully', async () =>
  {
    const docClient = createSuccessfulPutClient();
    await runCommand({ docClient, payload });

    expect(docClient.batchWrite).toHaveBeenCalledWith({
      RequestItems: {
        [tableName]: [putRequest(PUT_REQUESTS.SERVICE, PUT_REQUESTS.METADATA1, PUT_REQUESTS.METADATA2)]
      }
    });
  });

  it('should return failure if dynamodb batchWrite rejects', async () =>
  {
    const docClient = createFailedPutClient();
    const result = await runCommand({ docClient, payload });

    expect(result).toBeFailed();
  });
});