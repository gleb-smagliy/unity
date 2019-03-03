import { buildCompositeExtensionBuilder } from "../../../../src/request/schema-composing/executable-schema-composer/build-composite-extension-builder";

const DEFAULT_PAYLOAD = {
  typeDefs: [],
  resolvers: []
};

const ARRAY_EXTENSIONS = {
  typeDefs: ['type1', 'type2'],
  resolvers: [{ Query: 123, Mutation: 321 }]
};

const FLAT_EXTENSIONS = {
  typeDefs: 'type3',
  resolvers: { SomeType: 456 }
};

const createValidBuilder = (name, payload = DEFAULT_PAYLOAD) => ({
  name,
  buildSchemaExtensions: jest.fn().mockReturnValue({ success: true, payload })
});

describe('buildCompositeExtensionBuilder', () =>
{
  const runBuilders = (builders, metadata) =>
    buildCompositeExtensionBuilder(builders)({ metadata });

  it('should return failure if builder does not have a name', () =>
  {
    expect(runBuilders([123], {})).toBeFailed();
  });

  it('should return failure if transformer does not have a valid metadata', () =>
  {
    class ExtensionBuilder {}
    const metadata = {
      'builder_metadata': {}
    };

    expect(runBuilders([new ExtensionBuilder()], metadata)).toBeFailed();
  });

  it('should return failure if builder does not have a valid metadata', () =>
  {
    const builder = {
      name: 'builder',
      buildSchemaExtensions: jest.fn().mockReturnValue({ success: false, error: 'some err'})
    };

    const builders = [builder];

    const metadata = {
      'builder': {}
    };

    expect(runBuilders(builders, metadata)).toBeFailed();
  });

  it('should call builder with metadata', () =>
  {
    const builders = [
      createValidBuilder('builder')
    ];

    const metadata = {
      builder: { key: 'value' }
    };

    runBuilders(builders, metadata);

    expect(builders[0].buildSchemaExtensions).toHaveBeenCalledWith({ model: metadata.builder });
  });

  it('should return success and flatten builders outputs', () =>
  {
    const builders = [
      createValidBuilder('builder', ARRAY_EXTENSIONS),
      createValidBuilder('builder', ARRAY_EXTENSIONS)
    ];

    const metadata = {
      builder: { key: 'value' }
    };

    expect(runBuilders(builders, metadata)).toBeSuccessful(
      {
        typeDefs: [...ARRAY_EXTENSIONS.typeDefs, ...ARRAY_EXTENSIONS.typeDefs],
        resolvers: [...ARRAY_EXTENSIONS.resolvers, ...ARRAY_EXTENSIONS.resolvers]
      }
    );
  });

  it('should return success and flatten builders outputs when they are of mixed types', () =>
  {
    const builders = [
      createValidBuilder('builder', ARRAY_EXTENSIONS),
      createValidBuilder('builder', FLAT_EXTENSIONS)
    ];

    const metadata = {
      builder: { key: 'value' }
    };

    expect(runBuilders(builders, metadata)).toBeSuccessful(
      {
        typeDefs: [...ARRAY_EXTENSIONS.typeDefs, FLAT_EXTENSIONS.typeDefs],
        resolvers: [...ARRAY_EXTENSIONS.resolvers, FLAT_EXTENSIONS.resolvers]
      }
    );
  });

  it('should filter out null extensions when they are flat', () =>
  {
    const flatNullExtensions = {
      typeDefs: null,
      resolvers: null
    };

    const builders = [
      createValidBuilder('builder', ARRAY_EXTENSIONS),
      createValidBuilder('builder', flatNullExtensions)
    ];

    const metadata = {
      builder: { key: 'value' }
    };

    expect(runBuilders(builders, metadata)).toBeSuccessful(
      {
        typeDefs: [...ARRAY_EXTENSIONS.typeDefs],
        resolvers: [...ARRAY_EXTENSIONS.resolvers]
      }
    );
  });

  it('should filter out invalid extensions when they are array', () =>
  {
    const invalidArrayExtensions = {
      typeDefs: [null, '', 123, undefined],
      resolvers: [123, null, undefined, 'some_string']
    };

    const builders = [
      createValidBuilder('builder', ARRAY_EXTENSIONS),
      createValidBuilder('builder', invalidArrayExtensions)
    ];

    const metadata = {
      builder: { key: 'value' }
    };

    expect(runBuilders(builders, metadata)).toBeSuccessful(
      {
        typeDefs: [...ARRAY_EXTENSIONS.typeDefs],
        resolvers: [...ARRAY_EXTENSIONS.resolvers]
      }
    );
  });
});