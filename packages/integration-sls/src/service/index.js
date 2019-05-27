const express = require('express');
const { makeExecutableSchema } = require('graphql-tools');
const { ApolloServer } = require('apollo-server-express');
const GraphQLJSON  = require('graphql-type-json');

const METADATA = [
  {
    "__typename": "Metadata",
    "name": "key",
    "location": "OBJECT_TYPE",
    "typeName": "User",
    "fieldName": null,
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
    "fieldName": "firstName",
    "typeName": "User",
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

const typeDefs = `
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
    fieldName: String
    typeName: String
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
        lastName: 'Not existent last name',
        someCount: 123
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

const runServer = (server, path, port) =>
{
  const app = express();

  server.applyMiddleware({ app, path });

  return new Promise(r =>
  {
    const listener = app.listen({ port }, () =>
    {
      r(`http://localhost:${listener.address().port}${path}`);
    });
  })
};

const createServer = async ({ metadataQueryName = "_metadata", port = 0 } = {}, { includeMetadata = true, metadata = METADATA, path = '/graphql' } = {}) =>
{
  const schema = makeExecutableSchema({
    typeDefs: includeMetadata ?
      [typeDefs, metadataTypeDefs(metadataQueryName)] :
      typeDefs,
    resolvers: resolvers(metadataQueryName, { metadata, includeMetadata }),
    resolverValidationOptions: { requireResolversForResolveType: false }
  });

  const server = new ApolloServer({ schema, playground: true });

  const endpoint = await runServer(server, path, port);

  return {
    endpoint,
    metadata,
    schema
  }
};

module.exports = {
  METADATA,
  createServer,
  typeDefs
};