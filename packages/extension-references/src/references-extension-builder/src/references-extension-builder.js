import { createResolver } from './create-resolver';
import { ReferencesMetadataExtractor } from '../../references-metadata-extractor';

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
    const resolvers = {
      [model.aliasField.name]: createResolver(model),
    };

    return {
      success: true,
      payload: {
        typeDefs: ``,
        resolvers
      }
    }
  };
}