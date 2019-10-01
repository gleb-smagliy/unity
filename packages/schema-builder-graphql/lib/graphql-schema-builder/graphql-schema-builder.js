"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlSchemaBuilder = exports.GraphqlSchemaBuilder = exports.DEFAULT_OPTIONS = void 0;

var _graphqlTools = require("graphql-tools");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _apolloLinkHttp = require("apollo-link-http");

var _apolloClient = require("apollo-client");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _metadataSubgraphFilter = require("../metadata-subgraph-filter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const createMetadataQuery = metadataQueryName => _graphqlTag.default`
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

const DEFAULT_OPTIONS = {
  metadataQueryName: '_metadata',
  fetch: _nodeFetch.default
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

class GraphqlSchemaBuilder {
  constructor(options) {
    _defineProperty(this, "name", 'GraphqlSchemaBuilder');

    _defineProperty(this, "createHttpLink", ({
      endpoint,
      headers
    }) => new _apolloLinkHttp.HttpLink({
      uri: endpoint,
      headers,
      fetch: this.options.fetch
    }));

    _defineProperty(this, "getApiDefinition", () => ({
      name: 'GraphqlSchemaBuilder',
      type: 'GraphqlSchemaBuilderInput',
      definition: `
      input GraphqlSchemaBuilderInput
      {
        skipMetadata: Boolean = false
      }
    `
    }));

    _defineProperty(this, "transformSchema", schema => {
      const transforms = (0, _metadataSubgraphFilter.getTransforms)({
        metadataQueryName: this.options.metadataQueryName,
        schema
      });
      return (0, _graphqlTools.transformSchema)(schema, transforms);
    });

    _defineProperty(this, "buildServiceModel", async ({
      endpoint,
      headers
    }) => {
      const link = this.createHttpLink({
        endpoint,
        headers
      });

      try {
        const schema = await (0, _graphqlTools.introspectSchema)(link);
        return {
          success: true,
          payload: {
            schema: this.transformSchema(schema)
          }
        };
      } catch (e) {
        return {
          success: false,
          error: `GraphqlSchemaBuilder::buildServiceModel: <${e.message}>`
        };
      }
    });

    _defineProperty(this, "extractMetadata", async ({
      endpoint,
      headers,
      options: {
        skipMetadata
      } = {}
    }) => {
      if (skipMetadata) {
        return {
          success: true,
          payload: {
            metadata: []
          }
        };
      }

      const cache = new _apolloCacheInmemory.InMemoryCache();
      const link = this.createHttpLink({
        endpoint,
        headers
      });
      const client = new _apolloClient.ApolloClient({
        cache,
        link
      });
      let response;

      try {
        response = await client.query({
          query: this.metadataQuery
        }); // console.log('response:', response);

        const metadata = response.data.metadata;
        return {
          success: true,
          payload: {
            metadata
          }
        };
      } catch (e) {
        return {
          success: false,
          error: `GraphqlSchemaBuilder::extractMetadata: <${e.message}>`
        };
      }
    });

    this.options = { ...DEFAULT_OPTIONS,
      ...options
    };
    this.metadataQuery = createMetadataQuery(this.options.metadataQueryName);
  }

}

exports.GraphqlSchemaBuilder = GraphqlSchemaBuilder;

const graphqlSchemaBuilder = options => new GraphqlSchemaBuilder(options);

exports.graphqlSchemaBuilder = graphqlSchemaBuilder;