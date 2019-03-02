import { tryGetName } from './get-plugin-name';
import { tryGetPluginMetadata } from './get-plugin-metadata';

export const buildCompositeExtensionBuilder = extensionBuilders =>
{
  return ({ services, metadata }) =>
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
        typeDefs.push(...buildResult.payload.typeDefs);
      }
      else
      {
        typeDefs.push(buildResult.payload.typeDefs);
      }

      if(Array.isArray(buildResult.payload.resolvers))
      {
        typeDefs.push(...buildResult.payload.resolvers);
      }
      else
      {
        typeDefs.push(buildResult.payload.resolvers);
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