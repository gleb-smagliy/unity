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
    const { endpoint } = await createServer(DEFAULT_OPTIONS);
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

  it('Should remove default metadata query from introspected schema', async () =>
  {
    const builder = new GraphqlSchemaBuilder();
    const { endpoint } = await createServer(DEFAULT_OPTIONS);
    const result = await builder.buildServiceModel({
      id,
      options: { endpoint }
    });

    expect(result).toBeSuccessful();
    expect(result.payload.schema.getQueryType().getFields()).not.toHaveProperty(DEFAULT_OPTIONS.metadataQueryName);
  });

  it('Should remove metadata query with custom name from introspected schema', async () =>
  {
    const metadataQueryName = '_custom_metadata_query_name'
    const builder = new GraphqlSchemaBuilder({ metadataQueryName });
    const { endpoint } = await createServer(DEFAULT_OPTIONS);
    const result = await builder.buildServiceModel({
      id,
      options: { endpoint }
    });

    expect(result).toBeSuccessful();
    expect(result.payload.schema.getQueryType().getFields()).not.toHaveProperty(metadataQueryName);
  });

  it('Should remove types from metadata graph from introspected schema', async () =>
  {
    const builder = new GraphqlSchemaBuilder();
    const { endpoint } = await createServer(DEFAULT_OPTIONS);
    const result = await builder.buildServiceModel({
      id,
      options: { endpoint }
    });

    expect(result).toBeSuccessful();
    expect(result.payload.schema.getTypeMap()).not.toHaveProperty('SpecificMetadata');
  });

  it('Should return success with metadata information from remote service if metadata query is successful', async () =>
  {
    const builder = new GraphqlSchemaBuilder();
    const { endpoint, metadata } = await createServer(DEFAULT_OPTIONS);

    const result = await builder.extractMetadata({ id, options: { endpoint }});

    expect(result).toBeSuccessful();
    expect(result.payload.metadata).toEqual(metadata);
  });

  it('Should return failure if metadata query is failed', async () =>
  {
    const builder = new GraphqlSchemaBuilder();

    const result = await builder.extractMetadata({ id, options: { endpoint: 'not_exists' }});

    expect(result).toBeFailed();
  });

  it('Should be able to query metadata with custom metadata query name', async () =>
  {
    const metadataQueryName = 'metaQueryName';
    const builder = new GraphqlSchemaBuilder({ metadataQueryName });
    const { endpoint, metadata } = await createServer({ ...DEFAULT_OPTIONS, metadataQueryName });

    const result = await builder.extractMetadata({ id, options: { endpoint }});

    expect(result).toBeSuccessful();
    expect(result.payload.metadata).toEqual(metadata);
  });
});