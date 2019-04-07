import { ReferencesMetadataExtractor } from '../../references-metadata-extractor';
import { createResolver } from './create-resolver';
import { createTypeDefs } from './create-type-defs';

const METADATA_NAME = 'ref';

export class ReferencesExtensionBuilder
{
  name = 'ReferencesExtensionBuilder';

  constructor({ metadataName = METADATA_NAME } = {})
  {
    this.metadataName = metadataName;
  }

  getMetadataExtractor = () =>
  {
    return new ReferencesMetadataExtractor({
      metadataName: this.metadataName
    });
  };

  buildSchemaExtensions = ({ model: models }) =>
  {
    const resolvers = [];
    const typeDefs = [];

    for(let model of models)
    {
      const buildResolvers = createResolver(model);

      if(!buildResolvers.success)
      {
        return buildResolvers;
      }

      resolvers.push(buildResolvers.payload);

      const buildTypeDefs = createTypeDefs(model);

      if(!buildTypeDefs.success)
      {
        return buildTypeDefs;
      }

      typeDefs.push(buildTypeDefs.payload);
    }

    return {
      success: true,
      payload: {
        typeDefs,
        resolvers
      }
    };
  };
}