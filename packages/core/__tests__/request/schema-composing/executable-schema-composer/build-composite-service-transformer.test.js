import { buildCompositeServicesTransformer } from "../../../../src/request/schema-composing/executable-schema-composer/build-composite-service-transformer";

const DEFAULT_SERVICE = {
  id: 'default_service',
  schema: 'probably_invalid_schema - does not matter'
};

const createValidTransformer = (name, payload) => ({
  name,
  getTransforms: jest.fn().mockReturnValue({ success: true, payload })
});

describe('buildCompositeServicesTransformer', () =>
{
  const runTransformers = (transformers, services = [DEFAULT_SERVICE]) =>
    buildCompositeServicesTransformer(transformers)({ services });

  it('should return failure if transformer does not have a name', () =>
  {
    expect(runTransformers([123])).toBeFailed();
  });

  it('should return failure if transformer returns failure', () =>
  {
    const transformer = {
      name: 'transformer',
      getTransforms: jest.fn().mockReturnValue({ success: false, error: 'some err'})
    };

    const transformers = [transformer];

    expect(runTransformers(transformers)).toBeFailed();
  });

  it('should call transformer with service and metadata', () =>
  {
    const transformers = [
      createValidTransformer('transformer')
    ];

    runTransformers(transformers);

    expect(transformers[0].getTransforms).toHaveBeenCalledWith({
      service: {
        id: DEFAULT_SERVICE.id,
        schema: DEFAULT_SERVICE.schema
      }
    });
  });

  it('should return success and put transformations per service for single service', () =>
  {
    const transforms = [{key: 1}, {key: 2}];

    const transformers = [
      createValidTransformer('transformer', transforms),
      createValidTransformer('transformer', transforms)
    ];

    expect(runTransformers(transformers)).toBeSuccessful(
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

    const services = [
      { id: 'service1' },
      { id: 'service2' }
    ];

    expect(runTransformers(transformers, services)).toBeSuccessful(
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

    expect(runTransformers(transformers)).toBeSuccessful(
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

    expect(runTransformers(transformers)).toBeSuccessful(
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

    expect(runTransformers(transformers)).toBeSuccessful(
      {
        [DEFAULT_SERVICE.id]: transforms
      }
    );
  });
});