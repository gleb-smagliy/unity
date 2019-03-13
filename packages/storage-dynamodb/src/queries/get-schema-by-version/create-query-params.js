export const createQueryParams = ({ version, tableName }) => ({
  TableName: tableName,
  KeyConditionExpression: 'Version = :version',
  ExpressionAttributeValues:{
    ':version': version
  }
});