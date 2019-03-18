import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';

const metadata = ({ meta: '123' });

export const typeDefs = `
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

const metadataTypeDefs = `
  extend type Query {
    _metadata: SpecificMetadata
  }
  
  interface Metadata {
    name: String
  }
  
  type MetadataInfo implements Metadata {
    name: String
  }
  
  type Metadata1 implements Metadata {  name: String, kind: String, id: Int! }
  type Metadata2 implements Metadata {  name: String, type: String, count: Int! }
  type Metadata3 implements Metadata {  name: String }
  
  union MetadataUnion = Metadata1 | Metadata2 | Metadata3
  
  type SpecificMetadata implements Metadata {
    name: String
    meta: SpecificMetadata!
    info: [MetadataInfo]
    someUnion: MetadataUnion
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
  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, metadataTypeDefs],
    resolvers,
    resolverValidationOptions: { requireResolversForResolveType: false }
  });
  const server = new ApolloServer({ schema });

  const { url: endpoint } = await server.listen({ port: 0 });

  return {
    endpoint,
    metadata,
    schema
  }
};