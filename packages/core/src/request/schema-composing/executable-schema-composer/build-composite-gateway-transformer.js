import { tryGetName, isValidTransform, tryGetPluginMetadata } from '../../../common-modules/plugins';

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

      const getTransformsResult = transformer.getTransforms({ model: getTransformerMetadataResult.payload });

      if(!getTransformsResult.success) return getTransformsResult;

      if(Array.isArray(getTransformsResult.payload))
      {
        transforms.push(...getTransformsResult.payload);
      }
      else
      {
        transforms.push(getTransformsResult.payload);
      }
    }

    return {
      success: true,
      payload: transforms.filter(isValidTransform)
    }
  };
};