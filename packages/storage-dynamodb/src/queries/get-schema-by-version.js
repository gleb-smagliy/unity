import { toServices, toPluginsMetadata } from "./schema-mappings";

const createQueryParams = ({ version, tableName }) => ({
  TableName: tableName,
  KeyConditionExpression: 'Version = :version',
  ExpressionAttributeValues:{
    ':version': version
  }
});

const splitSchemaItems = items => ({
  metadata: toPluginsMetadata(items),
  services: toServices(items)
});

export const createGetSchemaByVersionQuery = ({ docClient, tableName }) =>
{
  return async ({ version }) =>
  {
    const params = createQueryParams({ version, tableName });

    try
    {
      const queryResult = await docClient.query(params).promise();

      return {
        success: true,
        payload: splitSchemaItems(queryResult)
      };
    }
    catch(err)
    {
      return {
        success: false,
        error: `GetSchemaByVersionQuery:: ${err.message}`
      };
    }
  };
};