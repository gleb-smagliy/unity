import { tryGetName, tryGetPluginMetadata } from '../../../common-modules/plugins';

const isValidTypeDef = t => typeof(t) === 'string' && t !== null && t.trim().length > 0;
const isValidResolver = r => typeof(r) === 'object' && r !== null;

export const buildCompositeExtensionBuilder = extensionBuilders =>
{
  return ({ metadata }) =>
  {
    const typeDefs = [];
    const resolvers = [];

    for(let builder of extensionBuilders)
    {
      const getNameResult = tryGetName(builder);

      if(!getNameResult.success) return getNameResult;

      const getBuilderMetadataResult = tryGetPluginMetadata(metadata, getNameResult.payload);

      if(!getBuilderMetadataResult.success) return getBuilderMetadataResult;

      const buildResult = builder.buildSchemaExtensions({ model: getBuilderMetadataResult.payload });

      if(!buildResult.success) return buildResult;

      if(Array.isArray(buildResult.payload.typeDefs))
      {
        typeDefs.push(...buildResult.payload.typeDefs.filter(isValidTypeDef));
      }
      else if(isValidTypeDef(buildResult.payload.typeDefs))
      {
        typeDefs.push(buildResult.payload.typeDefs);
      }

      if(Array.isArray(buildResult.payload.resolvers))
      {
        resolvers.push(...buildResult.payload.resolvers.filter(isValidResolver));
      }
      else if(isValidResolver(buildResult.payload.resolvers))
      {
        resolvers.push(buildResult.payload.resolvers);
      }
    }

    return {
      success: true,
      payload: {
        typeDefs,
        resolvers
      }
    }
  };
};