import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';

const metadata = ({ meta: '123' });

export const typeDefs = `
  type User {
    id: ID!
    firstName: String!
    lastName: String
  }
  
  type Query
  {
    me: User!
  }
`;

const metadataTypeDefs = `
  extend type Query {
    _metadata: Metadata
  }
  
  type Metadata {
    meta: Metadata,
    id: ID!
  }
`;

const resolvers = {
  Query: {
    me: () => ({
      id: 1,
      firstName: 'Not existent first name',
      lastName: 'Not existent last name'
    }),
    _metadata: () => metadata
  }
};

export const createServer = async () =>
{
  const schema = makeExecutableSchema({ typeDefs: [typeDefs, metadataTypeDefs], resolvers });
  const server = new ApolloServer({ schema });

  const { url: endpoint } = await server.listen({ port: 0 });

  return {
    endpoint,
    metadata,
    schema
  }
};