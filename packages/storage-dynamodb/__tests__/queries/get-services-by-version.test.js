import { createGetServicesByVersionQuery } from "../../src/queries/get-services-by-version";
import { ITEM_TYPE } from "../../src/queries/schema-mappings";
import { SERVICE, PLUGIN_METADATA } from '../fake-tables';
import { createFailedScanClient, createSuccessfulScanClient } from '../fake-dynamodb-client';

const tableName = 'test.Schema';
const version = 'aaaa-bbbb-cccc-dddd';

const runQuery = async ({ docClient, version }) =>
{
  const query = createGetServicesByVersionQuery({ docClient, tableName });

  return await query({ version });
};

describe('getSchemaByVersionQuery', () =>
{
  it('should return success with properly mapped services if dynamodb query resolves successfully', async () =>
  {
    const docClient = createSuccessfulScanClient([SERVICE]);
    const result = await runQuery({ version, docClient });

    expect(result).toBeSuccessful([
      {
        id: SERVICE.ServiceId,
        schema: SERVICE.Schema,
        stage: SERVICE.Stage,
        metadata: SERVICE.Metadata,
        endpoint: SERVICE.Endpoint
      }
    ]);
  });

  it('should return success with empty array if no services presented', async () =>
  {
    const docClient = createSuccessfulScanClient([]);
    const result = await runQuery({ version, docClient });

    expect(result).toBeSuccessful([]);
  });

  it.skip('should call dynamodb scan with right params', async () =>
  {
    const docClient = createSuccessfulScanClient([]);
    await runQuery({ version, docClient });

    expect(docClient.scan).toHaveBeenCalledWith({
      TableName: tableName,
      KeyConditionExpression: 'Version = :version',
      FilterExpression: 'Type = :type',
      ExpressionAttributeValues:{
        ':version': version,
        ':type': ITEM_TYPE.SERVICE
      }
    });
  });

  it('should return failure if dynamodb scan rejects', async () =>
  {
    const docClient = createFailedScanClient();
    const result = await runQuery({ version, docClient });

    expect(result).toBeFailed();
  });
});