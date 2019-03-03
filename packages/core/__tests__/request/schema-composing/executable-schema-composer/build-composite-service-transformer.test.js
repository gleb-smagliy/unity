import { buildCompositeServicesTransformer } from "../../../../src/request/schema-composing/executable-schema-composer/build-composite-service-transformer";

const DEFAULT_SERVICE = {
  id: 'default_service'
};

const createValidTransformer = (name, payload) => ({
  name,
  getTransforms: jest.fn().mockReturnValue({ success: true, payload })
});

describe('buildCompositeGatewayTransformer', () =>
{
  const runTransformers = (transformers, metadata, services = [DEFAULT_SERVICE]) =>
    buildCompositeServicesTransformer(transformers)({ services, metadata });

  it('should return failure if transformer does not have a name', () =>
  {
    expect(runTransformers([123], {})).toBeFailed();
  });

  it('should return failure if transformer does not have a valid metadata', () =>
  {
    class Transformer {}
    const metadata = {
      'transformer_metadata': {}
    };

    expect(runTransformers([new Transformer()], metadata)).toBeFailed();
  });

  it('should return failure if transformer does not have a valid metadata', () =>
  {
    const transformer = {
      name: 'transformer',
      getTransforms: jest.fn().mockReturnValue({ success: false, error: 'some err'})
    };

    const transformers = [transformer];

    const metadata = {
      'transformer': {}
    };

    expect(runTransformers(transformers, metadata)).toBeFailed();
  });

  it('should call transformer with service and metadata', () =>
  {
    const transformers = [
      createValidTransformer('transformer')
    ];

    const metadata = {
      transformer: { key: 'value' }
    };

    runTransformers(transformers, metadata);

    expect(transformers[0].getTransforms).toHaveBeenCalledWith({ model: metadata.transformer, service: DEFAULT_SERVICE});
  });

  it('should return success and put transformations per service for single service', () =>
  {
    const transforms = [{key: 1}, {key: 2}];

    const transformers = [
      createValidTransformer('transformer', transforms),
      createValidTransformer('transformer', transforms)
    ];

    const metadata = {
      transformer: { key: 'value' }
    };

    expect(runTransformers(transformers, metadata)).toBeSuccessful(
      {
        [DEFAULT_SERVICE.id]: [transforms[0], transforms[1], transforms[0], transforms[1]]
      }
    );
  });

  it('should return success and put transformations per service for multiple services', () =>
  {
    const transforms = [{key: 1}, {key: 2}];

    const transformers = [
      createValidTransformer('transformer', transforms),
      createValidTransformer('transformer', transforms)
    ];

    const metadata = {
      transformer: { key: 'value' }
    };

    const services = [
      { id: 'service1' },
      { id: 'service2' }
    ];

    expect(runTransformers(transformers, metadata, services)).toBeSuccessful(
      {
        service1: [transforms[0], transforms[1], transforms[0], transforms[1]],
        service2: [transforms[0], transforms[1], transforms[0], transforms[1]]
      }
    );
  });

  it('should return success and flatten transformers outputs when they are of mixed types', () =>
  {
    const transforms = [{key: 1}, {key: 2}];
    const singleTransform = {key: 3};

    const transformers = [
      createValidTransformer('transformer', transforms),
      createValidTransformer('transformer', singleTransform)
    ];

    const metadata = {
      transformer: { key: 'value' }
    };

    expect(runTransformers(transformers, metadata)).toBeSuccessful(
      {
        [DEFAULT_SERVICE.id]: [transforms[0], transforms[1], singleTransform]
      }
    );
  });

  it('should filter out null and undefined transforms', () =>
  {
    const transforms = [{key: 1}, {key: 2}];

    const transformers = [
      createValidTransformer('transformer', transforms),
      createValidTransformer('transformer', null),
      createValidTransformer('transformer', undefined)
    ];

    const metadata = {
      transformer: { key: 'value' }
    };

    expect(runTransformers(transformers, metadata)).toBeSuccessful(
      {
        [DEFAULT_SERVICE.id]: transforms
      }
    );
  });

  it('should filter out not object transforms', () =>
  {
    const transforms = [{key: 1}, {key: 2}];

    const transformers = [
      createValidTransformer('transformer', transforms),
      createValidTransformer('transformer', 123)
    ];

    const metadata = {
      transformer: { key: 'value' }
    };

    expect(runTransformers(transformers, metadata)).toBeSuccessful(
      {
        [DEFAULT_SERVICE.id]: transforms
      }
    );
  });
});