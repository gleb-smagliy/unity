import { createQueryParams } from './create-query-params';
import { splitSchemaItems } from './split-schema-items';

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
        error: err.message
      };
    }
  };
};