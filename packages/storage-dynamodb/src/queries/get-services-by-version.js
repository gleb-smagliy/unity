import { toServices, ITEM_TYPE } from './schema-mappings';
import { execute } from '../execute-dynamodb-operation';

const createQueryParams = ({ version, tableName }) => ({
  TableName: tableName,
  KeyConditionExpression: 'Version = :version and begins_with(Id, :type)',
  ExpressionAttributeValues: {
    ':version': version,
    ':type': ITEM_TYPE.SERVICE
  },
});

const transformError = err => `GetServicesByVersionQuery:: ${err.message}`;

export const createGetServicesByVersionQuery = ({ docClient, tableName }) => async ({ version }) =>
{
  const params = createQueryParams({ version, tableName });

  return execute(docClient.query(params), { transformPayload: toServices, transformError });
};