const { buildSchema, buildClientSchema, graphqlSync, introspectionFromSchema } = require("graphql");

export const buildFakeClientSchema = (typeDefs) =>
{
  const graphqlSchemaObj = buildSchema(typeDefs);
  return introspectionFromSchema(graphqlSchemaObj);

  // return buildClientSchema(result);
};