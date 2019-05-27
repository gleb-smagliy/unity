import { toServices, toPluginsMetadata } from "./schema-mappings";
import { execute } from '../execute-dynamodb-operation';

const createQueryParams = ({ version, tableName }) => ({
  TableName: tableName,
  KeyConditionExpression: 'Version = :version',
  ExpressionAttributeValues:{
    ':version': version
  }
});

const transformPayload = items => ({
  pluginsMetadata: toPluginsMetadata(items),
  services: toServices(items)
});

const transformError = err => `GetSchemaByVersionQuery:: ${err.message}`;

export const createGetSchemaByVersionQuery = ({ docClient, tableName }) => async ({ version }) =>
{
  const params = createQueryParams({ version, tableName });

  console.log('GetSchemaByVersionQuery::params:', params);

  return execute(docClient.query(params), { transformPayload, transformError });
};