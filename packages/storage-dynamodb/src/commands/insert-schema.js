import { execute } from '../execute-dynamodb-operation';

const createParams = ({ tableName, tag, version, stage }) => ({
  TableName: tableName,
  Item: {
    Tag: tag,
    Version: version,
    Stage: stage
  }
});

const transformError = error => `InsertSchemaCommand::${error.message}`;

export const createInsertSchemaCommand = ({ docClient, tableName }) => async ({
  version,
  services,
  pluginsMetadata
}) =>
{
  const params = createParams({ tableName, tag, version, stage });

  return execute(docClient.put(params), { transformError });
};