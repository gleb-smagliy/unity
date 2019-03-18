import { createServer, typeDefs } from './create-server';
import { GraphqlSchemaBuilder, DEFAULT_OPTIONS } from '../../src/graphql-schema-builder/graphql-schema-builder';
import { parse, Kind, introspectionFromSchema, buildClientSchema, buildSchema } from 'graphql';

const id = 'TEST_SERVICE';

describe('GraphqlSchemaBuilder', () =>
{
  it('should have name property equals to returning from getApiDefinition', async () =>
  {
    const builder = new GraphqlSchemaBuilder();
    const apiDefinition = builder.getApiDefinition();

    expect(apiDefinition.name).toEqual(builder.name);
  });

  it('should return apiDefinition with only one input', async () =>
  {
    const apiDefinition = new GraphqlSchemaBuilder().getApiDefinition();
    const { definitions } = parse(apiDefinition.definition);

    expect(definitions).toHaveLength(1);
    expect(definitions[0].kind).toEqual(Kind.INPUT_OBJECT_TYPE_DEFINITION);
  });

  it('should return apiDefinition with consistent type names', async () =>
  {
    const apiDefinition = new GraphqlSchemaBuilder().getApiDefinition();
    const { definitions: [ definition ] } = parse(apiDefinition.definition);

    expect(definition.name.value).toEqual(apiDefinition.type);
  });

  it('Should return success with schema introspected from service endpoint (without metadata part)', async () =>
  {
    const builder = new GraphqlSchemaBuilder();
    const { endpoint } = await createServer();
    const result = await builder.buildServiceModel({
      id,
      options: { endpoint }
    });

    expect(result).toBeSuccessful();

    const actualSchemaIntrospection = result.payload.schema;
    const expectedSchemaIntrospection = buildSchema(typeDefs);

    expect(Object.keys(actualSchemaIntrospection.getQueryType().getFields())).toEqual(Object.keys(expectedSchemaIntrospection.getQueryType().getFields()));
    expect(Object.keys(actualSchemaIntrospection.getTypeMap())).toEqual(Object.keys(expectedSchemaIntrospection.getTypeMap()));
  });

  it('Should return failure if service is not available', async () =>
  {
    const builder = new GraphqlSchemaBuilder();
    const result = await builder.buildServiceModel({
      id,
      options: { endpoint: 'http://not_available' }
    });

    expect(result).toBeFailed();
  });
  //
  // it('Should remove default metadata query from introspected schema', async () =>
  // {
  //   const builder = new GraphqlSchemaBuilder();
  //   const { endpoint } = await createServer(DEFAULT_OPTIONS);
  //   const result = await builder.buildServiceModel({
  //     id,
  //     options: { endpoint }
  //   });
  //
  //   console.log('result.payload.schema', result.payload.schema.getQueryType().getFields());
  //
  //   expect(result).toBeSuccessful();
  //   expect(result.payload.schema.getQueryType().getFields()).not.toHaveProperty(DEFAULT_OPTIONS.metadataQueryName);
  // });

  // it.skip('Should remove types from metadata graph from introspected schema', async () =>
  // {
  //   throw new Error();
  // });

  // it.skip('Should remove types from metadata graph with cycles from introspected schema', async () =>
  // {
  //   throw new Error();
  // });

  it.skip('Should return success with metadata information from remote service if metadata query is successful', async () =>
  {
    throw new Error();
  });

  it.skip('Should return failure if metadata query is failed', async () =>
  {
    throw new Error();
  });

  it.skip('Should be able to query metadata with custom metadata query name', async () =>
  {
    throw new Error();
  });
});