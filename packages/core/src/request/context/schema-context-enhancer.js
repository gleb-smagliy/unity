import { createQuery, createQueryMany } from './batched-query';

const schemaSymbol = Symbol('schema');

export const getSchemaFromContext = (context) => context[schemaSymbol];

export const schemaContextEnhancer = () =>
{
  const loadersCache = {};

  return {
    [schemaSymbol]: {
      batchQuery: createQuery(loadersCache),
      batchQueryMany: createQueryMany(loadersCache)
    }
  };
};