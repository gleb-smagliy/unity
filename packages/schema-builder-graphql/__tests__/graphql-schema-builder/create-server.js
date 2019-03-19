import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';
import { DEFAULT_OPTIONS } from "../../src/graphql-schema-builder/graphql-schema-builder";

export const METADATA = [
  {
    "__typename": "Metadata",
    "name": "key",
    "location": "OBJECT_TYPE",
    "arguments": [
      {
        "__typename": "MetadataArgument",
        "name": "fields",
        "value": ["id", "name"]
      }
    ]
  },
  {
    "__typename": "Metadata",
    "name": "ref",
    "location": "OBJECT_FIELD",
    "arguments": [
      {
        "__typename": "MetadataArgument",
        "name": "query",
        "value": "friendById"
      },
      {
        "__typename": "MetadataArgument",
        "name": "as",
        "value": "friend"
      }
    ]
  }
];

export const typeDefs = `
  scalar JSON
  
  type User {
    id: ID!
    someCount: Int!
    firstName: String!
    lastName: String
  }
  
  type Query
  {
    me: User!
  }
`;

const metadataTypeDefs = (metadataQueryName) => `
  extend type Query {
    ${metadataQueryName}: [Metadata]
  }
  
  type MetadataArgument {
    name: String
    value: JSON
  }
  
  type Metadata {
    name: String,
    location: String
    arguments: [MetadataArgument] 
  }
`;

const resolvers = (metadataQueryName, { includeMetadata, metadata }) =>
{
  const resolversMap ={
    Query: {
      me: () => ({
        id: 1,
        firstName: 'Not existent first name',
        lastName: 'Not existent last name'
      })
    },
    JSON: GraphQLJSON
  };

  if(includeMetadata)
  {
    resolversMap.Query[metadataQueryName] = () => metadata;
  }

  return resolversMap;
};

export const createServer = async ({ metadataQueryName }, { includeMetadata = true, metadata = METADATA } = {}) =>
{
  const schema = makeExecutableSchema({
    typeDefs: includeMetadata ?
      [typeDefs, metadataTypeDefs(metadataQueryName)] :
      typeDefs,
    resolvers: resolvers(metadataQueryName, { metadata, includeMetadata }),
    resolverValidationOptions: { requireResolversForResolveType: false }
  });
  const server = new ApolloServer({ schema });

  const { url: endpoint } = await server.listen({ port: 0, playground: true });

  return {
    endpoint,
    metadata,
    schema
  }
};