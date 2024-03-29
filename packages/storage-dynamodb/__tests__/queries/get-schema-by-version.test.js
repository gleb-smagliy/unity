import { buildClientSchema } from 'graphql';
import { createGetSchemaByVersionQuery } from "../../src/queries/get-schema-by-version";
import { SCHEMA_TABLE, SERVICE, PLUGIN_METADATA } from '../fake-tables';
import { createSuccessfulQueryClient, createFailedQueryClient } from '../fake-dynamodb-client';

const tableName = 'test.Schema';
const version = 'aaaa-bbbb-cccc-dddd';

const runQuery = async ({ docClient, version }) => {
  const query = createGetSchemaByVersionQuery({ docClient, tableName });

  return await query({ version });
};

describe('getSchemaByVersionQuery', () =>
{
  it('should return success with properly mapped services if dynamodb query resolves successfully', async () =>
  {
    const docClient = createSuccessfulQueryClient(SCHEMA_TABLE);
    const result = await runQuery({ docClient, version });

    const expectedService = {
      id: SERVICE.ServiceId,
      schema: buildClientSchema(JSON.parse(SERVICE.Schema)),
      args: SERVICE.Args,
      metadata: SERVICE.Metadata,
      endpoint: SERVICE.Endpoint
    };

    expect(result).toBeSuccessful();
    expect(result.payload.services).toEqual([expectedService]);
  });

  it('should return success with properly mapped plugins metadata if dynamodb query resolves successfully', async () =>
  {
    const docClient = createSuccessfulQueryClient(SCHEMA_TABLE);
    const result = await runQuery({ docClient, version });

    expect(result).toBeSuccessful();
    expect(result.payload.pluginsMetadata).toEqual({
      [PLUGIN_METADATA.PluginName]: [PLUGIN_METADATA.Metadata]
    });
  });

  it('should call dynamodb query with right params', async () =>
  {
    const docClient = createSuccessfulQueryClient(SCHEMA_TABLE);
    await runQuery({ docClient, version });

    expect(docClient.query).toHaveBeenCalledWith({
      TableName: tableName,
      KeyConditionExpression: 'Version = :version',
      ExpressionAttributeValues: {
        ':version': version
      }
    });
  });

  it('should return failure if dynamodb rejects', async () =>
  {
    const docClient = createFailedQueryClient();
    const result = await runQuery({ docClient, version });

    expect(result).toBeFailed();
  });
});