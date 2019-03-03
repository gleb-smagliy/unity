const { buildSchema, buildClientSchema, graphqlSync, introspectionQuery } = require("graphql");

export const buildFakeClientSchema = (typeDefs) =>
{
  const graphqlSchemaObj = buildSchema(typeDefs);
  const result = graphqlSync(graphqlSchemaObj, introspectionQuery).data;

  return buildClientSchema(result);
};