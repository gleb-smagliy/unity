import { makeExecutableSchema } from 'graphql-tools';
import { createTypeDefinitions } from './create-type-definitions';
import { createResolvers } from './create-resolvers';

export const createSchema = ({
  schemaBuilders,
  registrationHandler
}) =>
{
  const apiDefinitions = schemaBuilders.map(b => b.getApiDefinition());

  return makeExecutableSchema({
    typeDefs: createTypeDefinitions(apiDefinitions),
    resolvers: createResolvers({ apiDefinitions, registrationHandler })
  });
};