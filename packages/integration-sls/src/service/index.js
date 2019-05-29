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
      r(`http://localhost:${listener.address().port}${path}`);
    });
  })
};

const createServer = async ({ port = 0 } = {}, { path = '/graphql' } = {}) =>
{
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: resolvers()
  });

  const server = new ApolloServer({ schema, playground: true });

  const endpoint = await runServer(server, path, port);

  return {
    endpoint,
    schema
  }
};

module.exports = {
  createServer,
  typeDefs
};