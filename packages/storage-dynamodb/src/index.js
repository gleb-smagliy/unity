import { DynamoDB } from 'aws-sdk'
import {
  createGetSchemaByVersionQuery,
  createGetServicesByVersionQuery,
  createGetVersionByTagQuery
} from './queries';

export const createStorage = ({
  clientOptions,
  tables: {
    schema,
    tags
  }
}) =>
{
  const docClient = new DynamoDB.DocumentClient(clientOptions);

  return {
    queries: {
      getSchemaByVersion: createGetSchemaByVersionQuery({ docClient, tableName: schema }),
      getServicesByVersion: createGetServicesByVersionQuery({ docClient, tableName: schema }),
      getVersionByTag: createGetVersionByTagQuery({ docClient, tableName: tags }),
    }
  };
};