import { RenameRootFields } from 'graphql-tools';

import {
  ServiceRegistrationCommandHander,
  LOCK_STATUS,
  SYSTEM_TAGS
} from "../../../src/registration/command-handlers/registration-handler";

import {
  createSuccessfulStorage,
  services,
  RETURN_VERSION as STABLE_VERSION
} from "../../fake-storage/create-storage";

import { exampleServiceTransformer } from '../../fake-plugins';
import { buildFakeClientSchema } from '../../fake-schema';

const GRAPHQL_COMMAND = {
  id: 'User',
  schemaBuilder: 'graphql',
  options: { endpoint: 'http://localhost:8080/graphql' }
};

const SERVICE_TRANSFORMS = {
  User: [new RenameRootFields((operation, name) => `User_${name}`),]
};

/* ===LOCKING MOCKS=== */

const LOCK_ID = '123';
const createSuccessfulLocking = () => ({
  acquireLock: jest.fn().mockResolvedValue({ success: true, payload: { status: LOCK_STATUS.ACQUIRED, id: LOCK_ID }}),
  isLockAcquired: jest.fn().mockResolvedValue({ success: true, payload: false }),
  releaseLock: jest.fn().mockResolvedValue({ success: true })
});


// TRANSFORMS CHECKS

const toServiceDefinition = service => ({
  service: {
    id: service.id,
    schema: service.schema
  }
});

const expectServiceToBeTransformeed = (getTransforms, service) =>
  expect(getTransforms).toHaveBeenCalledWith(toServiceDefinition(service));

const expectServiceNotToBeTransformeed = (getTransforms, service) =>
  expect(getTransforms).not.toHaveBeenCalledWith(toServiceDefinition(service));


/* ===BUILDER MOCKS=== */

const USER_SCHEMA = buildFakeClientSchema(`
  type User {
    id: ID!
    firstName: String!
    lastName: String
  }

  type Query {
    me: User!
  }
`);

const DEFAULT_BUILDER = {
  name: 'graphql',
  service: { id: GRAPHQL_COMMAND.id, schema: USER_SCHEMA}
};
const createFailedBuilder = ({ name = DEFAULT_BUILDER.name } = {}) => ({
  name,
  buildServiceModel: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' })
});
const createSuccessfulBuilder = ({ name, service, metadata } = DEFAULT_BUILDER) => ({
  name,
  buildServiceModel: jest.fn().mockResolvedValue({ success: true, payload: service }),
  extractMetadata: jest.fn().mockResolvedValue({
    success: true,
    payload: metadata })
});
// const GRAPHQL_SCHEMA_BUILDERS = [createSuccessfulBuilder()];


/* ===TESTS=== */

describe('ServiceRegistrationCommandHander', () =>
{
  it('should take a lock with service id to register a service', async () =>
  {
    const locking = createSuccessfulLocking();
    const handler = new ServiceRegistrationCommandHander({
      locking,
      storage: createSuccessfulStorage(),
      schemaBuilders: [createSuccessfulBuilder()],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    await handler.execute(GRAPHQL_COMMAND);

    expect(locking.acquireLock).toHaveBeenCalledTimes(1);
    expect(locking.acquireLock).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id });
  });

  it('should return success with lock status, name and time', async () =>
  {
    const lockId = 'lock_name';
    const lockTime = 123456;

    const lock = {
      status: LOCK_STATUS.ALREADY_LOCKED,
      id: lockId,
      time: lockTime
    };

    const locking = {
      acquireLock: jest.fn().mockResolvedValue({
        success: true,
        payload: { ...lock }
      })
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      storage: createSuccessfulStorage(),
      schemaBuilders: [createSuccessfulBuilder()],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful({ lock });
  });

  it('should return a failure if lock cannot be acquired', async () =>
  {
    const locking = {
      acquireLock: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' })
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      storage: createSuccessfulStorage(),
      schemaBuilders: [createSuccessfulBuilder()],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
  });

  it('should return failure and release lock if specified schema builder is not present in options', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaBuilders = [{ name: 'openapi' }];

    const handler = new ServiceRegistrationCommandHander({
      locking,
      schemaBuilders,
      storage: createSuccessfulStorage(),
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should return failure if lock releasing failed', async () =>
  {
    const locking = {
      ...createSuccessfulLocking(),
      releaseLock: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' })
    };
    const schemaBuilders = [{ name: 'openapi' }];

    const handler = new ServiceRegistrationCommandHander({
      locking,
      schemaBuilders,
      storage: createSuccessfulStorage(),
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request schema from schema builder according to passed command', async () =>
  {
    const builder = createSuccessfulBuilder();

    const handler = new ServiceRegistrationCommandHander({
      locking: createSuccessfulLocking(),
      storage: createSuccessfulStorage(),
      schemaBuilders: [builder],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should return failure and release lock if schema builder returns failure', async () =>
  {
    const builder = createFailedBuilder();
    const locking = createSuccessfulLocking();

    const handler = new ServiceRegistrationCommandHander({
      locking,
      storage: createSuccessfulStorage(),
      schemaBuilders: [builder],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should request version by stable tag from storage', async () =>
  {
    const storage = createSuccessfulStorage();

    const handler = new ServiceRegistrationCommandHander({
      locking: createSuccessfulLocking(),
      schemaBuilders: [createSuccessfulBuilder()],
      storage,
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(storage.queries.getVersionByTag).toHaveBeenCalledTimes(1);
    expect(storage.queries.getVersionByTag).toHaveBeenCalledWith({ tag: SYSTEM_TAGS.STABLE });
  });

  it('should return failure and release lock if cannot take a version by stable tag from storage', async () =>
  {
    const locking = createSuccessfulLocking();
    const storage = {
      ...createSuccessfulStorage(),
      queries: {
        ...createSuccessfulStorage().queries,
        getVersionByTag: jest.fn().mockResolvedValue({ success: false, error: 'some error' })
      }
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      schemaBuilders: [createSuccessfulBuilder()],
      storage,
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(storage.queries.getVersionByTag).toHaveBeenCalledTimes(1);
    expect(storage.queries.getVersionByTag).toHaveBeenCalledWith({ tag: SYSTEM_TAGS.STABLE });
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request services from storage by tagged as stable version', async () =>
  {
    const storage = createSuccessfulStorage();

    const handler = new ServiceRegistrationCommandHander({
      locking: createSuccessfulLocking(),
      schemaBuilders: [createSuccessfulBuilder()],
      storage,
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledTimes(1);
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledWith({ version: STABLE_VERSION });
  });

  it('should return failure and release lock if cannot take a services', async () =>
  {
    const locking = createSuccessfulLocking();
    const storage = {
      ...createSuccessfulStorage(),
      queries: {
        ...createSuccessfulStorage().queries,
        getServicesByVersion: jest.fn().mockResolvedValue({ success: false, error: 'some error' })
      }
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      schemaBuilders: [createSuccessfulBuilder()],
      storage,
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledTimes(1);
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledWith({ version: STABLE_VERSION });
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request service metadata from schema builder', async () =>
  {
    const builder = createSuccessfulBuilder();

    const handler = new ServiceRegistrationCommandHander({
      locking: createSuccessfulLocking(),
      storage: createSuccessfulStorage(),
      schemaBuilders: [builder],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(builder.extractMetadata).toHaveBeenCalledTimes(1);
    expect(builder.extractMetadata).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should return failure and release lock if extracting metadata returns failure', async () =>
  {
    const locking = createSuccessfulLocking();

    const builder = {
        ...createSuccessfulBuilder(),
      extractMetadata: jest.fn().mockResolvedValue({ success: false, error: 'extract metadata error' })
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      storage: createSuccessfulStorage(),
      schemaBuilders: [builder],
      serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(builder.extractMetadata).toHaveBeenCalledTimes(1);
    expect(builder.extractMetadata).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should call transformer for all services once (and take new definition for registering service)', async () =>
  {
    const newServiceFromStorage = {
      ...DEFAULT_BUILDER.service,
      id: GRAPHQL_COMMAND.id,
      schema: 123
    };

    const transformer = exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS });

    const handler = new ServiceRegistrationCommandHander({
      locking: createSuccessfulLocking(),
      storage: createSuccessfulStorage({
        services: [...services, newServiceFromStorage]
      }),
      schemaBuilders: [createSuccessfulBuilder()],
      serviceSchemaTransformers: [transformer]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(transformer.getTransforms).toHaveBeenCalledTimes(3);
    expectServiceToBeTransformeed(transformer.getTransforms, services[0]);
    expectServiceToBeTransformeed(transformer.getTransforms, services[1]);
    expectServiceToBeTransformeed(transformer.getTransforms, DEFAULT_BUILDER.service);
    expectServiceNotToBeTransformeed(transformer.getTransforms, newServiceFromStorage);
  });

  it('should return failure and release lock if transformer returns failure', async () =>
  {
    const transformer = exampleServiceTransformer({
      success: false
    });

    const locking = createSuccessfulLocking();

    const handler = new ServiceRegistrationCommandHander({
      locking,
      storage: createSuccessfulStorage(),
      schemaBuilders: [createSuccessfulBuilder()],
      serviceSchemaTransformers: [transformer]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(transformer.getTransforms).toHaveBeenCalled();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it.skip('should extract metadata using metadata extractors for extension builders', async () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if extension builder metadata extractor returns failure', async () =>
  {
    throw new Error();
  });

  it.skip('should extract metadata using metadata extractors for gateway transformers', async () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if gateway transformer metadata extractor returns failure', async () =>
  {
    throw new Error();
  });

  it.skip('should save new services using storage', async () =>
  {
    throw new Error();
  });

  it.skip('should assign a new version to the services using versioning strategy from options', async () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if services could not be saved', async () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if services could not be saved', async () =>
  {
    throw new Error();
  });

  it.skip('should return new schema version', async () =>
  {
    throw new Error();
  });
});