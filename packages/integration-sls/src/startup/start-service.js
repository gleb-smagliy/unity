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

const resolvers = () => ({
  Query: {
    me: () => ({
      id: 1,
      firstName: 'Not existent first name',
      lastName: 'Not existent last name',
      someCount: 123
    })
  }
});

const runServer = (server, path, port) =>
{
  const app = express();

  server.applyMiddleware({ app, path });

  return new Promise(r =>
  {
    const listener = app.listen({ port }, () =>
    {
      r({
        endpoint: `http://localhost:${listener.address().port}${path}`,
        close: () => listener.close()
      });
    });
  });
};

const startService = async (options = {}, { path = '/graphql' } = {}) =>
{
  const {
    port = 0,
    schema,
    typeDefs: schemaTypeDefs = typeDefs,
    resolvers: schemaResolvers = resolvers()
  } = options;

  const serviceSchema = schema || makeExecutableSchema({
    typeDefs: schemaTypeDefs,
    resolvers: schemaResolvers
  });

  const server = new ApolloServer({
    schema: serviceSchema,
    playground: true,
    context: ({ req }) => ({
      headers: req.headers
    })
  });

  const { endpoint, close } = await runServer(server, path, port);

  return {
    endpoint,
    close,
    resolvers: schemaResolvers
  }
};

module.exports = {
  startService,
  typeDefs
};