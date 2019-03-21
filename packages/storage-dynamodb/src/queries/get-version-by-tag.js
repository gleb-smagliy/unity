import {execute} from "../execute-dynamodb-operation";

const transformResult = (items) =>
{
  const item = items[0];

  if(typeof(item) !== 'object')
  {
    return {
      success: true,
      payload: {
        version: null,
        args: {}
      }
    };
  }

  return {
    success: true,
    payload: {
      version: item.Version,
      args: item.Args || {}
    }
  };
};

const createQueryParams = ({ tag, tableName }) => ({
  TableName: tableName,
  KeyConditionExpression: 'Tag = :tag',
  ExpressionAttributeValues:{
    ':tag': tag
  }
});

const transformError = error => `GetVersionByTagQuery:: ${error.message}`;

export const createGetVersionByTagQuery = ({ docClient, tableName }) => async ({ tag }) =>
{
  const params = createQueryParams({ tag, tableName });

  return execute(docClient.query(params), { transformResult, transformError });
};