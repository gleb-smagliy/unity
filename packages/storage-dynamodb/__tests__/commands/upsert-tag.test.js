import { createUpsertTagCommand } from "../../src/commands";
import { createFailedPutClient, createSuccessfulPutClient } from '../fake-dynamodb-client';

const tableName = 'test.Tag';

const runCommand = async ({ docClient, payload }) =>
{
  const query = createUpsertTagCommand({ docClient, tableName });

  return await query(payload);
};

const payload = {
  tag: 'some_tag',
  version: 'aaa-bbb',
  stage: 'prod'
};

describe('upsertTag command', () =>
{
  it('should return success if dynamodb put resolves successfully', async () =>
  {
    const docClient = createSuccessfulPutClient();
    await runCommand({ docClient, payload });

    expect(docClient.put).toHaveBeenCalledWith({
      TableName: tableName,
      Item: {
        Tag: payload.tag,
        Version: payload.version,
        Stage: payload.stage
      }
    });
  });

  it('should return failure if dynamodb put rejects', async () =>
  {
    const docClient = createFailedPutClient();
    const result = await runCommand({ docClient, payload });

    expect(result).toBeFailed();
  });
});