import {
  ServiceRegistrationCommandHander,
  LOCK_STATUS,
  SYSTEM_TAGS
} from "../../../src/registration/command-handlers/registration-handler";

import { createSuccessfulStorage } from "../../fake-storage/create-storage";

const GRAPHQL_COMMAND = {
  id: 'User',
  schemaBuilder: 'graphql',
  options: { endpoint: 'http://localhost:8080/graphql' }
};

/* ===LOCKING MOCKS=== */

const LOCK_ID = '123';
const createSuccessfulLocking = () => ({
  acquireLock: jest.fn().mockResolvedValue({ success: true, payload: { status: LOCK_STATUS.ACQUIRED, id: LOCK_ID }}),
  isLockAcquired: jest.fn().mockResolvedValue({ success: true, payload: false }),
  releaseLock: jest.fn().mockResolvedValue({ success: true })
});


/* ===BUILDER MOCKS=== */

const DEFAULT_BUILDER = { name: 'graphql', payload: { schema: { type: 'Query' }} };
const createFailedBuilder = ({ name = DEFAULT_BUILDER.name } = {}) => ({
  name,
  buildServiceModel: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' })
});
const createSuccessfulBuilder = ({ name, payload } = DEFAULT_BUILDER) => ({
  name,
  buildServiceModel: jest.fn().mockResolvedValue({ success: true, payload })
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
      schemaBuilders: [createSuccessfulBuilder()]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

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
      schemaBuilders: [createSuccessfulBuilder()]
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
      schemaBuilders: [createSuccessfulBuilder()]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
  });

  it('should return failure and release lock if specified schema builder is not present in options', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaBuilders = [{ name: 'openapi' }];

    const handler = new ServiceRegistrationCommandHander({ locking, schemaBuilders });

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

    const handler = new ServiceRegistrationCommandHander({ locking, schemaBuilders });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request schema from schema builder according to passed command', async () =>
  {
    const builder = createSuccessfulBuilder();

    const handler = new ServiceRegistrationCommandHander({
      locking: createSuccessfulLocking(),
      schemaBuilders: [builder]
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
      schemaBuilders: [builder]
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should request version by stable tag from storage', async () =>
  {
    const STABLE_VERSION = 'aaaa-bbbb';
    const builder = createFailedBuilder();
    const locking = createSuccessfulLocking();
    const storage = {
      queries: {
        getVersionByTag: jest.fn().mockResolvedValue({ success: true, payload: STABLE_VERSION })
      }
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      schemaBuilders: [builder],
      storage
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(storage.queries.getVersionByTag).toHaveBeenCalledTimes(1);
    expect(storage.queries.getVersionByTag).toHaveBeenCalledWith({ tag: SYSTEM_TAGS.STABLE });
  });

  it('should return failure and release lock if cannot take a version by stable tag from storage', async () =>
  {
    const builder = createFailedBuilder();
    const locking = createSuccessfulLocking();
    const storage = {
      queries: {
        getVersionByTag: jest.fn().mockResolvedValue({ success: false, error: 'some error' })
      }
    };

    const handler = new ServiceRegistrationCommandHander({
      locking,
      schemaBuilders: [builder],
      storage
    });

    const result = await handler.execute(GRAPHQL_COMMAND);

    expect(result).toBeFailed();
    expect(storage.queries.getVersionByTag).toHaveBeenCalledTimes(1);
    expect(storage.queries.getVersionByTag).toHaveBeenCalledWith({ tag: SYSTEM_TAGS.STABLE });
  });

  it.skip('should request services from storage by tagged as stable version', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if cannot take a services', () =>
  {
    throw new Error();
  });

  it.skip('should request service metadata from metadata builder by specified schema builder', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if metadata builder returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should transform schemas using schema transformers', () =>
  {
    throw new Error();
  });

  it.skip('should extract metadata using metadata extractors for extension builders', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if extension builder metadata extractor returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should extract metadata using metadata extractors for gateway transformers', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if gateway transformer metadata extractor returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should save new services using storage', () =>
  {
    throw new Error();
  });

  it.skip('should assign a new version to the services using versioning strategy from options', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if services could not be saved', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if services could not be saved', () =>
  {
    throw new Error();
  });

  it.skip('should return new schema version', () =>
  {
    throw new Error();
  });
});