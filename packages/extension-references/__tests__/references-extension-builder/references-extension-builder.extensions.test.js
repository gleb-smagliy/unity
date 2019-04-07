import { parse, Kind, print } from 'graphql';

import { model } from './metadata-model';
import {ReferencesExtensionBuilder} from "../../src/references-extension-builder";

describe('ReferencesExtensionBuilder:buildSchemaExtensions', () =>
{
  it('should return success if model is valid', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const result = builder.buildSchemaExtensions({ model: [model] });

    expect(result).toBeSuccessful();
  });

  it('should return typeDefs of type string', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const typeDefs = builder.buildSchemaExtensions({ model: [model] }).payload.typeDefs[0];

    expect(typeof(typeDefs[0])).toEqual('string');
  });

  it('should return valid graphql document as typeDefs', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const typeDefs = builder.buildSchemaExtensions({ model: [model] }).payload.typeDefs[0];
    const typeDefsAst = parse(typeDefs);

    expect(typeDefsAst.kind).toEqual(Kind.DOCUMENT);
  });

  it('should return type defs with single definition', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const typeDefs = builder.buildSchemaExtensions({ model: [model] }).payload.typeDefs[0];
    const { definitions } = parse(typeDefs);

    expect(definitions).toHaveLength(1);
  });

  it('should return type defs extending specified type', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const typeDefs = builder.buildSchemaExtensions({ model: [model] }).payload.typeDefs[0];
    const { definitions: [definition] } = parse(typeDefs);

    expect(definition.kind).toEqual(Kind.OBJECT_TYPE_EXTENSION);
    expect(definition.name.value).toEqual('Availability');
  });

  it('should return extensions with single field', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const typeDefs = builder.buildSchemaExtensions({ model: [model] }).payload.typeDefs[0];
    const { definitions: [definition] } = parse(typeDefs);
    const { fields } = definition;

    expect(fields).toHaveLength(1);
  });

  it('should return extensions with specified field name', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const typeDefs = builder.buildSchemaExtensions({ model: [model] }).payload.typeDefs[0];
    const { definitions: [{ fields: [field] }] } = parse(typeDefs);

    expect(field.kind).toEqual(Kind.FIELD_DEFINITION);
    expect(field.name.value).toEqual('levels');
    expect(print(field.type)).toEqual('[Level]');
  });

  it.skip('should return failure when metadata model is invalid (e.g. empty)', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const result = builder.buildSchemaExtensions({ model: [model] });

    expect(result).toBeFailed();
  });
});