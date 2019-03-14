const toVersion = (items) =>
{
  const item = items[0];

  if(typeof(item) !== 'object')
  {
    return {
      success: false,
      error: 'GetVersionByTagQuery: queried items[0] is not an object'
    };
  }

  return {
    success: true,
    payload: {
      version: item.Version,
      stage: item.Stage
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

export const createGetVersionByTagQuery = ({ docClient, tableName }) =>
{
  return async ({ tag }) =>
  {
    const params = createQueryParams({ tag, tableName });

    try
    {
      const queryResult = await docClient.query(params).promise();

      return toVersion(queryResult);
    }
    catch(err)
    {
      return {
        success: false,
        error: `GetVersionByTagQuery:: ${err.message}`
      };
    }
  };
};