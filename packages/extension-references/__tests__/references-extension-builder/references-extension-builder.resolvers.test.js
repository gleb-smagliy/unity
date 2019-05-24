import { ReferencesExtensionBuilder } from '../../src/references-extension-builder/src/references-extension-builder';
import { model } from './metadata-model';
import { schemaContextEnhancer } from '@soyuz/core';
import { createInfo } from './resolver-utils';

describe('ReferencesExtensionBuilder::resolvers', () =>
{
  it('should return successful result', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const result = builder.buildSchemaExtensions({ model: [model] });

    expect(result).toBeSuccessful();
  });

  it.only('should return resolver for alias field, which is a function', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const resolvers = builder.buildSchemaExtensions({ model: [model] }).payload.resolvers[0][model.sourceType];

    const resolver = resolvers['levels'].resolve;

    expect(typeof(resolver)).toEqual('function');
  });

  it('should return resolver for alias field, which query schema by sourceKey from parent (when resolves array)', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const resolvers = builder.buildSchemaExtensions({ model: [model] }).payload.resolvers[0][model.sourceType];
    const resolver = resolvers[model.aliasField.name].resolve;

    const parent = {
      levelsIds: [1, 2, 3]
    };

    const args = {};
    const context = schemaContextEnhancer();
    const { info, delegationResult } = createInfo([{ id: 1 }, { id: 2 }, { id: 3 }]);

    const result = await resolver(parent, args, context, info);

    expect(result).toEqual(delegationResult);
  });

  it('should return resolver for alias field, which query schema with right args (when resolves array)', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const resolvers = builder.buildSchemaExtensions({ model: [model] }).payload.resolvers[0][model.sourceType];
    const resolver = resolvers[model.aliasField.name].resolve;

    const parent = {
      levelsIds: [1, 2, 3]
    };

    const args = {};
    const context = schemaContextEnhancer();
    const { info } = createInfo([{ id: 1 }, { id: 2 }, { id: 3 }]);

    await resolver(parent, args, context, info);
    const delegationInfo = info.mergeInfo.delegateToSchema.mock.calls[0][0];

    expect(delegationInfo.args).toEqual({ ids: parent.levelsIds });
    expect(delegationInfo.fieldName).toEqual(model.targetQuery.name);
  });

  it('should return resolver for alias field, which query schema by sourceKey from parent (when resolves single value)', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const resolvers = builder.buildSchemaExtensions({ model: [model] }).payload.resolvers[0][model.sourceType];
    const resolver = resolvers[model.aliasField.name].resolve;

    const parent = {
      levelsIds: 1
    };

    const args = {};
    const context = schemaContextEnhancer();
    const { info, delegationResult } = createInfo([{ id: 1 }]);

    const result = await resolver(parent, args, context, info);

    expect(result).toEqual(delegationResult[0]);
  });

  it('should return resolver for alias field, which query schema with right query and args (when resolves single value)', async () =>
  {
    const builder = new ReferencesExtensionBuilder();

    const resolvers = builder.buildSchemaExtensions({ model: [model] }).payload.resolvers[0][model.sourceType];
    const resolver = resolvers[model.aliasField.name].resolve;

    const parent = {
      levelsIds: 1
    };

    const args = {};
    const context = schemaContextEnhancer();
    const { info } = createInfo([{ id: 1 }]);

    await resolver(parent, args, context, info);
    const delegationInfo = info.mergeInfo.delegateToSchema.mock.calls[0][0];

    expect(delegationInfo.args).toEqual({ ids: [parent.levelsIds] });
    expect(delegationInfo.fieldName).toEqual(model.targetQuery.name);
  });

  it('should return failure when model is invalid (e.g. empty)', async () =>
  {
    const model = {};

    const builder = new ReferencesExtensionBuilder();

    const result = builder.buildSchemaExtensions({ model: [model] });

    expect(result).toBeFailed();
  });
});