import { toServices, ITEM_TYPE } from './schema-mappings';

const createQueryParams = ({ version, tableName }) => ({
  TableName: tableName,
  KeyConditionExpression: 'Version = :version',
  FilterExpression: 'Type = :type',
  ExpressionAttributeValues:{
    ':version': version,
    ':type': ITEM_TYPE.SERVICE
  },
});

export const createGetServicesByVersionQuery = ({ docClient, tableName }) =>
{
  return async ({ version }) =>
  {
    const params = createQueryParams({ version, tableName });

    try
    {
      const scanResult = await docClient.scan(params).promise();

      return {
        success: true,
        payload: toServices(scanResult)
      };
    }
    catch(err)
    {
      return {
        success: false,
        error: `GetServicesByVersionQuery:: ${err.message}`
      };
    }
  };
};