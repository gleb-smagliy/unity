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
    return {
      success: true,
      payload: {
        typeDefs: ``,
        resolvers: {
          Query: () => ({})
        }
      }
    }
  };
}