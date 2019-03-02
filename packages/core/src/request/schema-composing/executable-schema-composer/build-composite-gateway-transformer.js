import { tryGetName } from './get-plugin-name';
import { tryGetPluginMetadata } from './get-plugin-metadata';

export const buildCompositeGatewayTransformer = (transformers) =>
{
  return ({ metadata }) =>
  {
    const transforms = [];

    for(let transformer of transformers)
    {
      const getNameResult = tryGetName(transformer);

      if(!getNameResult.success) return getNameResult;

      const getTransformerMetadataResult = tryGetPluginMetadata(metadata, getNameResult.payload);

      if(!getTransformerMetadataResult.success) return getTransformerMetadataResult;

      const getTransformResult = transformer.getTransform({ model: getTransformerMetadataResult.payload });

      if(!getTransformResult.success) return getTransformResult;

      if(Array.isArray(getTransformResult.payload))
      {
        transforms.push(...getTransformResult.payload);
      }
      else
      {
        transforms.push(getTransformResult.payload);
      }
    }

    return {
      success: true,
      payload: transforms.filter(t => typeof(t) === 'object' && t !== null)
    }
  };
};