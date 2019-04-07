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

  buildSchemaExtensions = ({ model }) =>
  {
    const buildResolvers = createResolver(model);

    if(!buildResolvers.success)
    {
      return buildResolvers;
    }

    const buildTypeDefs = createTypeDefs(model);

    if(!buildTypeDefs.success)
    {
      return buildTypeDefs;
    }

    return {
      success: true,
      payload: {
        typeDefs: buildTypeDefs.payload,
        resolvers: buildResolvers.payload
      }
    };
  };
}