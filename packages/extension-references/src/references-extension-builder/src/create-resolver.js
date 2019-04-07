import { getSchemaFromContext } from '@soyuz/core';

const prepareTargetArgs = (key, sourceFieldValues) => sourceFieldValues.map(value => ({ [key]: value }));

export const createResolver = (model) => async (parent, args, context, info) =>
{
  const sourceKey = model.sourceKeys[0];
  const targetKey = model.targetKeys[0];
  const query = model.targetQuery.name;

  const sourceFieldValues = parent[sourceKey];

  const schema = getSchemaFromContext(context);

  if(Array.isArray(sourceFieldValues))
  {
    const targetArgs = prepareTargetArgs(targetKey, sourceFieldValues);

    return await schema.batchQueryMany({ query, args: targetArgs, context, info });
  }

  const targetArgs = { [targetKey]: sourceFieldValues };

  return await schema.batchQuery({ query, args: targetArgs, context, info });
};