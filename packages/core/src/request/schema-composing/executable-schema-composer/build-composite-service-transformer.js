import { tryGetName, isValidTransform } from '../../../common-modules/plugins';

export const buildCompositeServicesTransformer = (transformers) =>
{
  return ({ services }) =>
  {
    const transforms = {};

    // todo: O(n * m) - could we do something to achieve lower complexity?
    for(let transformer of transformers)
    {
      for(let service of services)
      {
        const getNameResult = tryGetName(transformer);

        if(!getNameResult.success) return getNameResult;

        const getTransformsResult = transformer.getTransforms({
          service: {
            id: service.id,
            schema: service.schema
          }
        });

        if(!getTransformsResult.success) return getTransformsResult;

        if(!transforms[service.id])
        {
          transforms[service.id] = [];
        }

        if(Array.isArray(getTransformsResult.payload))
        {
          transforms[service.id].push(...getTransformsResult.payload.filter(isValidTransform));
        }
        else if(isValidTransform(getTransformsResult.payload))
        {
          transforms[service.id].push(getTransformsResult.payload);
        }
      }
    }

    return {
      success: true,
      payload: transforms
    }
  };
};