import { execute } from '../execute-dynamodb-operation';

const createParams = ({ tableName, tag, version, stage }) => ({
  TableName: tableName,
  Item: {
    Tag: tag,
    Version: version,
    Stage: stage
  }
});

const transformError = error => `UpsertTagCommand::${error.message}`;

export const createUpsertTagCommand = ({ docClient, tableName }) => async ({
  tag,
  version,
  stage
}) =>
{
  const params = createParams({ tableName, tag, version, stage });

  return execute(docClient.put(params), { transformError });
};