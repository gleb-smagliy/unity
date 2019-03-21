import { createGetVersionByTagQuery } from "../../src/queries/get-version-by-tag";
import { createFailedQueryClient, createSuccessfulQueryClient } from '../fake-dynamodb-client';
import { TAGS_TABLE, TAG } from '../fake-tables';

const tableName = 'test.Schema';
const tag = 'test';

const runQuery = async ({ docClient, tag }) => {
  const query = createGetVersionByTagQuery({ docClient, tableName });

  return await query({ tag });
};

describe('getSchemaByVersionQuery', () =>
{
  it('should return success with properly mapped tag if dynamodb query resolves successfully', async () =>
  {
    const docClient = createSuccessfulQueryClient(TAGS_TABLE);
    const result = await runQuery({ docClient, tag });

    expect(result).toBeSuccessful({
      version: TAG.Version,
      args: TAG.Args
    });
  });

  it('should call dynamodb query with right params', async () =>
  {
    const docClient = createSuccessfulQueryClient(TAGS_TABLE);
    await runQuery({ docClient, tag });

    expect(docClient.query).toHaveBeenCalledWith({
      TableName: tableName,
      KeyConditionExpression: 'Tag = :tag',
      ExpressionAttributeValues:{
        ':tag': tag
      }
    });
  });

  it('should return version and stage equal to nulls if dynamodb resolves 0 items', async () =>
  {
    const docClient = createSuccessfulQueryClient([]);
    const result = await runQuery({ docClient, tag });

    expect(result).toBeSuccessful({
      version: null,
      args: {}
    });
  });

  it('should return failure if dynamodb rejects', async () =>
  {
    const docClient = createFailedQueryClient();
    const result = await runQuery({ docClient, tag });

    expect(result).toBeFailed();
  });
});