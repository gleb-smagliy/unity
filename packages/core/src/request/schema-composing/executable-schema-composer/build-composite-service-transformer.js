import { tryGetName } from './get-plugin-name';
import { tryGetPluginMetadata } from './get-plugin-metadata';

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

        const getTransformResult = transformer.getTransform({ service: service, model: getTransformerMetadataResult.payload });

        if(!getTransformResult.success) return getTransformResult;

        if(!transforms[service.id])
        {
          transforms[service.id] = [];
        }

        if(Array.isArray(getTransformResult.payload))
        {
          transforms[service.id].push(...getTransformResult.payload);
        }
        else
        {
          transforms[service.id].push(getTransformResult.payload);
        }
      }
    }

    return {
      success: true,
      payload: transforms
    }
  };
};