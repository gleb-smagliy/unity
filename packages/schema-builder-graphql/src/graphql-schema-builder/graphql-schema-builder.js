import { introspectSchema, transformSchema, FilterRootFields } from 'graphql-tools';
import { fetch } from 'node-fetch';
import { HttpLink } from 'apollo-link-http';

export const DEFAULT_OPTIONS = {
  metadataQueryName: '_metadata'
};

export class GraphqlSchemaBuilder
{
  name = 'GraphqlSchemaBuilder';

  constructor(options)
  {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
  }

  getApiDefinition = () => ({
    name: 'GraphqlSchemaBuilder',
    type: 'GraphqlSchemaBuilderInput',
    definition: `
      input GraphqlSchemaBuilderInput
      {
        endpoint: String
      }
    `
  });

  isNotMetadataQuery = (operation, fieldName) => operation !== 'Query' || fieldName !== this.options.metadataQueryName;

  transformSchema = (schema) =>
  {
    const removeMetadataField = new FilterRootFields(this.isNotMetadataQuery);

    return transformSchema(schema, [removeMetadataField]);
  };

  buildServiceModel = async ({ options: { endpoint }}) =>
  {
    const link = new HttpLink({ uri: endpoint, fetch });

    try
    {
      const schema = await introspectSchema(link);

      return {
        success: true,
        payload: {
          schema: this.transformSchema(schema)
        }
      }
    }
    catch (e) {
      return {
        success: false,
        error: `GraphqlSchemaBuilder::buildServiceModel: <${e.message}>`
      };
    }



  };
}
