const { buildSchema, introspectionFromSchema, buildClientSchema } = require("graphql");

const buildFakeClientSchema = (typeDefs) =>
{
  const graphqlSchemaObj = buildSchema(typeDefs);
  const introspection = introspectionFromSchema(graphqlSchemaObj);

  return buildClientSchema(introspection);
};

export const createServicesHash = (schemaDefinition, metadata) => ({
  getTransformedClientSchema: jest.fn().mockReturnValue(buildFakeClientSchema(schemaDefinition)),
  getMetadata: jest.fn().mockReturnValue([metadata]),
});