const express = require('express');
const { makeExecutableSchema } = require('graphql-tools');
const { ApolloServer } = require('apollo-server-express');
const GraphQLJSON  = require('graphql-type-json');

const typeDefs = `
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
    }
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