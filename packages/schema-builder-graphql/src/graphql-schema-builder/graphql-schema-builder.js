import { introspectSchema, transformSchema, FilterRootFields } from 'graphql-tools';
import fetch from 'node-fetch';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from 'graphql-tag';
import { getTransforms } from '../metadata-subgraph-filter';

const createMetadataQuery = metadataQueryName => gql`
  {
    metadata: ${metadataQueryName} {
      name,
      location,
      fieldName,
      typeName,
      arguments {
        name,
        value
      }
    }
  }
`;

export const DEFAULT_OPTIONS = {
  metadataQueryName: '_metadata',
  fetch
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

    this.metadataQuery = createMetadataQuery(this.options.metadataQueryName);
  }

  getApiDefinition = () => ({
    name: 'GraphqlSchemaBuilder',
    type: 'GraphqlSchemaBuilderInput',
    definition: `
      input GraphqlSchemaBuilderInput
      {
        skipMetadata: Boolean = false
      }
    `
  });

  transformSchema = (schema) =>
  {
    const transforms = getTransforms({ metadataQueryName: this.options.metadataQueryName, schema });

    return transformSchema(schema, transforms);
  };

  buildServiceModel = async ({ endpoint }) =>
  {
    const link = new HttpLink({ uri: endpoint, fetch: this.options.fetch });

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
    catch (e)
    {
      return {
        success: false,
        error: `GraphqlSchemaBuilder::buildServiceModel: <${e.message}>`
      };
    }
  };

  extractMetadata = async ({ endpoint, options: { skipMetadata } = {} }) =>
  {
    if(skipMetadata)
    {
      return {
        success: true,
        payload: {
          metadata: []
        }
      }
    }

    const cache = new InMemoryCache();
    const link = new HttpLink({ uri: endpoint, fetch });
    const client = new ApolloClient({ cache, link });

    let response;

    try
    {
      response = await client.query({
        query: this.metadataQuery
      });

      const metadata = response.data.metadata;

      return {
        success: true,
        payload: { metadata }
      }
    }
    catch (e)
    {
      return {
        success: false,
        error: `GraphqlSchemaBuilder::extractMetadata: <${e.message}>`
      }
    }
  };
}

export const graphqlSchemaBuilder = (options) => new GraphqlSchemaBuilder(options);