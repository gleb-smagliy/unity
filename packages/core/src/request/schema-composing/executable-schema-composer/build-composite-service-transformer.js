import { tryGetName } from './get-plugin-name';
import { tryGetPluginMetadata } from './get-plugin-metadata';
import { isValidTransform } from "./is-valid-transform";

export const buildCompositeServicesTransformer = (transformers) =>
{
  return ({ services, metadata }) =>
  {
    const transforms = {};

    // todo: O(n * m) - could we do something to achieve lower complexity?
    for(let transformer of transformers)
    {
      for(let service of services)
      {
        const getNameResult = tryGetName(transformer);

        if(!getNameResult.success) return getNameResult;

        const getTransformerMetadataResult = tryGetPluginMetadata(metadata, getNameResult.payload);

        if(!getTransformerMetadataResult.success) return getTransformerMetadataResult;

        const getTransformsResult = transformer.getTransforms({ service: service, model: getTransformerMetadataResult.payload });

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