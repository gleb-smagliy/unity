import { getSchemaFromContext, addSpecialHeader } from '@soyuz/core';
import { parseResolverModel } from './parse-resolver-model';

const prepareTargetArgs = (key, sourceFieldValues) => sourceFieldValues.map(value => ({ [key]: value }));

export const createResolver = (model) =>
{
  const parseResult = parseResolverModel(model);

  if(!parseResult.success)
  {
    return parseResult;
  }

  const { query, sourceType, sourceKey, targetKey } = parseResult.payload;

  const resolve = async (parent, args, context, info) =>
  {
    const sourceFieldValues = parent[sourceKey];

    const schema = getSchemaFromContext(context);

    const downstreamContext = addSpecialHeader(context, 'ref', '1');

    // const downstreamContext = {
    //   ...context,
    //   headers: {
    //     ...context.headers,
    //     'x-soyuz-ref': '1'
    //   }
    // };

    if(Array.isArray(sourceFieldValues))
    {
      const targetArgs = prepareTargetArgs(targetKey, sourceFieldValues);

      return await schema.batchQueryMany({ query, args: targetArgs, context: downstreamContext, info });
    }

    const targetArgs = { [targetKey]: sourceFieldValues };

    return await schema.batchQuery({ query, args: targetArgs, context: downstreamContext, info });
  };

  return {
    success: true,
    payload: {
      [sourceType]: {
        [model.aliasField.name]: {
          fragment: `... on ${sourceType} { ${sourceKey} }`,
          resolve
        }
      }
    }
  }
};