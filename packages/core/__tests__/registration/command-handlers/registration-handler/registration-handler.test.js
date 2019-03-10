import { executeHandler } from "./execute-handler";
import { ServiceRegistrationCommandHander, LOCK_STATUS, SYSTEM_TAGS } from "../../../../src/registration/command-handlers/registration-handler";
import { createSuccessfulStorage, services, RETURN_VERSION as STABLE_VERSION } from "../../../fake-storage/create-storage";
import { createSuccessfulLocking, LOCK_ID } from './fake-locking';
import { exampleServiceTransformer } from '../../../fake-plugins';
import { expectServiceNotToBeTransformeed, expectServiceToBeTransformeed } from "./transform-assertions";
import {
  createFailedBuilder,
  createSuccessfulBuilder,
  DEFAULT_BUILDER,
  USER_SCHEMA
} from './fake-schema-builders';
import { GRAPHQL_COMMAND } from "./graphql-command";


describe('ServiceRegistrationCommandHander', () =>
{
  it('should take a lock with service id to register a service', async () =>
  {
    // const locking = createSuccessfulLocking();
    // const handler = new ServiceRegistrationCommandHander({
    //   locking,
    //   storage: createSuccessfulStorage(),
    //   schemaBuilders: [createSuccessfulBuilder()],
    //   serviceSchemaTransformers: [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })]
    // });
    //
    // await handler.execute(GRAPHQL_COMMAND);

    const { locking } = await executeHandler();

    expect(locking.acquireLock).toHaveBeenCalledTimes(1);
    expect(locking.acquireLock).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id });
  });

  it('should return success with lock status, name and time', async () =>
  {
    const lock = {
      status: LOCK_STATUS.ALREADY_LOCKED,
      id: 'lock_id',
      time: 123456
    };

    const { result } = await executeHandler({
      locking: {
        acquireLock: jest.fn().mockResolvedValue({ success: true, payload: lock })
      }
    });

    expect(result).toBeSuccessful({ lock });
  });

  it('should return a failure if lock cannot be acquired', async () =>
  {
    const { result } = await executeHandler({
      locking: {
        acquireLock: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' })
      }
    });

    expect(result).toBeFailed();
  });

  it('should return failure and release lock if specified schema builder is not present in options', async () =>
  {
    const { locking, result } = await executeHandler({
      schemaBuilders: [createSuccessfulBuilder({ name: 'openapi'})]
    });

    expect(result).toBeFailed();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should return failure if lock releasing failed', async () =>
  {
    const { locking, result } = await executeHandler({
      locking: { releaseLock: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' }) },
      schemaBuilders: [createSuccessfulBuilder({ name: 'openapi'})]
    });

    expect(result).toBeFailed();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request schema from schema builder according to passed command', async () =>
  {
    const { builder, result } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should return failure and release lock if schema builder returns failure', async () =>
  {
    const { builder, locking, result } = await executeHandler({
      schemaBuilders: [createFailedBuilder()]
    });

    expect(result).toBeFailed();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should request version by stable tag from storage', async () =>
  {
    const { storage, result } = await executeHandler(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(storage.queries.getVersionByTag).toHaveBeenCalledTimes(1);
    expect(storage.queries.getVersionByTag).toHaveBeenCalledWith({ tag: SYSTEM_TAGS.STABLE });
  });

  it('should return failure and release lock if cannot take a version by stable tag from storage', async () =>
  {
    const { storage, result, locking } = await executeHandler({
      storage: {
        queries: {
          getVersionByTag: jest.fn().mockResolvedValue({ success: false, error: 'some error' })
        }
      }
    });

    expect(result).toBeFailed();
    expect(storage.queries.getVersionByTag).toHaveBeenCalledTimes(1);
    expect(storage.queries.getVersionByTag).toHaveBeenCalledWith({ tag: SYSTEM_TAGS.STABLE });
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request services from storage by tagged as stable version', async () =>
  {
    const { storage, result } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledTimes(1);
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledWith({ version: STABLE_VERSION });
  });

  it('should return failure and release lock if cannot take a services', async () =>
  {
    const { locking, storage, result } = await executeHandler({
      storage: {
        queries: {
          getServicesByVersion: jest.fn().mockResolvedValue({ success: false, error: 'some error' })
        }
      }
    });

    expect(result).toBeFailed();
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledTimes(1);
    expect(storage.queries.getServicesByVersion).toHaveBeenCalledWith({ version: STABLE_VERSION });
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should request service metadata from schema builder', async () =>
  {
    const { builder, result } = await executeHandler(GRAPHQL_COMMAND);

    expect(result).toBeSuccessful();
    expect(builder.extractMetadata).toHaveBeenCalledTimes(1);
    expect(builder.extractMetadata).toHaveBeenCalledWith({ id: GRAPHQL_COMMAND.id, options: GRAPHQL_COMMAND.options });
  });

  it('should return failure and release lock if extracting metadata returns failure', async () =>
  {
    const { result, builder, locking } = await executeHandler({
      builderExtension: {
        extractMetadata: jest.fn().mockResolvedValue({ success: false, error: 'extract metadata error' })
      }
    });

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

    const {
      result,
      serviceTransformers: [transformer]
    } = await executeHandler({
      storage: createSuccessfulStorage({ services: [...services, newServiceFromStorage] })
    });

    expect(result).toBeSuccessful();
    expect(transformer.getTransforms).toHaveBeenCalledTimes(3);
    expectServiceToBeTransformeed(transformer.getTransforms, services[0]);
    expectServiceToBeTransformeed(transformer.getTransforms, services[1]);
    expectServiceToBeTransformeed(transformer.getTransforms, DEFAULT_BUILDER.service);
    expectServiceNotToBeTransformeed(transformer.getTransforms, newServiceFromStorage);
  });

  it('should return failure and release lock if transformer returns failure', async () =>
  {
    const {
      locking,
      result,
      serviceTransformers: [transformer]
    } = await executeHandler({
      serviceSchemaTransformers: [exampleServiceTransformer({ success: false })]
    });

    expect(result).toBeFailed();
    expect(transformer.getTransforms).toHaveBeenCalled();
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it.skip('should extract model using metadata extractors for extension builders', async () =>
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