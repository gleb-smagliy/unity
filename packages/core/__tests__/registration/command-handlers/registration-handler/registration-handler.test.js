import { executeHandler } from "./execute-handler";
import { SYSTEM_TAGS } from "../../../../src/registration/command-handlers/constants/system-tags";
import { ServiceRegistrationCommandHander } from "../../../../src/registration/command-handlers/registration-handler";
import { LOCK_STATUS } from "../../../../src/registration/modules/locking";
import { createSuccessfulStorage, services, RETURN_VERSION as STABLE_VERSION } from "../../../fake-storage";
import {createFailedFakeVersioning, NEW_VERSION} from './fake-versioning';
import { exampleServiceTransformer } from '../../../fake-plugins';
import { expectServiceNotToBeTransformeed, expectServiceToBeTransformeed } from "./transform-assertions";
import {
  createFailedBuilder,
  createSuccessfulBuilder,
  DEFAULT_BUILDER
} from './fake-schema-builders';
import { GRAPHQL_COMMAND } from "./graphql-command";
import {createFailedExtractorPlugin, DEFAULT_NAME as SOME_METADATA_NAME, SOME_METADATA} from "./fake-extractor-plugins";
import {LOCK_ID} from "./fake-locking";

describe('ServiceRegistrationCommandHander', () =>
{
  it('should take a lock with service id to register a service', async () =>
  {
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
    expect(builder.buildServiceModel).toHaveBeenCalledWith({
      id: GRAPHQL_COMMAND.id,
      options: GRAPHQL_COMMAND.options,
      endpoint: GRAPHQL_COMMAND.endpoint
    });
  });

  it('should request schema from schema builder according to passed command if endpoint contains args', async () =>
  {
    const command = {
      ...GRAPHQL_COMMAND,
      endpoint: 'http://localhost/[stage]/graphql',
      args: {
        stage: 'prod'
      }
    };

    const { builder, result } = await executeHandler({ command });

    expect(result).toBeSuccessful();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({
      id: GRAPHQL_COMMAND.id,
      options: GRAPHQL_COMMAND.options,
      endpoint: 'http://localhost/prod/graphql'
    });
  });

  it('should return failure and release lock if schema builder returns failure', async () =>
  {
    const { builder, locking, result } = await executeHandler({
      schemaBuilders: [createFailedBuilder()]
    });

    expect(result).toBeFailed();
    expect(builder.buildServiceModel).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
    expect(builder.buildServiceModel).toHaveBeenCalledWith({
      id: GRAPHQL_COMMAND.id,
      options: GRAPHQL_COMMAND.options,
      endpoint: GRAPHQL_COMMAND.endpoint
    });
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
    expect(builder.extractMetadata).toHaveBeenCalledWith({
      id: GRAPHQL_COMMAND.id,
      options: GRAPHQL_COMMAND.options,
      endpoint: GRAPHQL_COMMAND.endpoint
    });
  });

  it('should request service metadata from schema builder replacing args in endpoint if endpoint contains args', async () =>
  {
    const command = {
      ...GRAPHQL_COMMAND,
      endpoint: 'http://localhost/[stage]/graphql',
      args: {
        stage: 'prod'
      }
    };

    const { builder, result } = await executeHandler({ command });

    expect(result).toBeSuccessful();
    expect(builder.extractMetadata).toHaveBeenCalledTimes(1);
    expect(builder.extractMetadata).toHaveBeenCalledWith({
      id: GRAPHQL_COMMAND.id,
      options: GRAPHQL_COMMAND.options,
      endpoint: 'http://localhost/prod/graphql'
    });
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
    expect(builder.extractMetadata).toHaveBeenCalledWith({
      id: GRAPHQL_COMMAND.id,
      options: GRAPHQL_COMMAND.options,
      endpoint: GRAPHQL_COMMAND.endpoint
    });
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

  it('should extract model using metadata extractors for extension builders', async () =>
  {
    const { result, extensionBuilders: [extensionBuilder] } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(extensionBuilder.getMetadataExtractor).toHaveBeenCalledTimes(1);
    expect(extensionBuilder.metadataExtractor.extractMetadata).toHaveBeenCalledTimes(1);
  });

  it('should return failure and release lock if extension builder metadata extractor returns failure', async () =>
  {
    const {
      locking,
      result,
      extensionBuilders: [extensionBuilder]
    } = await executeHandler({
      extensionBuilders: [createFailedExtractorPlugin()]
    });

    expect(result).toBeFailed();
    expect(extensionBuilder.getMetadataExtractor).toHaveBeenCalledTimes(1);
    expect(extensionBuilder.metadataExtractor.extractMetadata).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should extract metadata using metadata extractors for gateway transformers', async () =>
  {
    const { result, gatewayTransformers: [transformer] } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(transformer.getMetadataExtractor).toHaveBeenCalledTimes(1);
    expect(transformer.metadataExtractor.extractMetadata).toHaveBeenCalledTimes(1);
  });

  it('should return failure and release lock if gateway transformer metadata extractor returns failure', async () =>
  {
    const {
      locking,
      result,
      gatewayTransformers: [transformer]
    } = await executeHandler({
      gatewaySchemaTransformers: [createFailedExtractorPlugin()]
    });

    expect(result).toBeFailed();
    expect(transformer.getMetadataExtractor).toHaveBeenCalledTimes(1);
    expect(transformer.metadataExtractor.extractMetadata).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should insert all services under new version using storage', async () =>
  {
    const { result, storage } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(storage.commands.insertSchema).toHaveBeenCalledTimes(1);

    const [{ version, services: insertingServices}] = storage.commands.insertSchema.mock.calls[0];

    expect(version).toEqual(NEW_VERSION);
    expect(insertingServices).toHaveLength(services.length + 1);
  });

  it.only('should preserve args while inserting services to storage', async () =>
  {
    const args = {
      stage: 'prod'
    };

    const command = {
      ...GRAPHQL_COMMAND,
      endpoint: 'http://localhost/[stage]/graphql',
      args
    };

    const { result, storage } = await executeHandler({ command });

    expect(result).toBeSuccessful();
    expect(storage.commands.insertSchema).toHaveBeenCalledTimes(1);

    const [{ services: insertingServices}] = storage.commands.insertSchema.mock.calls[0];

    const newService = insertingServices.find(s => s.id === GRAPHQL_COMMAND.id);
    expect(newService).not.toEqual(null);
    expect(newService.args).toEqual(args);
  });

  it.only('should preserve string with placeholders for service endpoint while inserting services to storage', async () =>
  {
    const endpoint = 'http://localhost/[stage]/graphql';

    const command = {
      ...GRAPHQL_COMMAND,
      endpoint,
      args: {
        stage: 'prod'
      }
    };

    const { result, storage } = await executeHandler({ command });

    expect(result).toBeSuccessful();
    expect(storage.commands.insertSchema).toHaveBeenCalledTimes(1);

    const [{ services: insertingServices}] = storage.commands.insertSchema.mock.calls[0];

    const newService = insertingServices.find(s => s.id === GRAPHQL_COMMAND.id);
    expect(newService).not.toEqual(null);
    expect(newService.endpoint).toEqual(endpoint);
  });

  it('should insert plugins metadata under new version using storage', async () =>
  {
    const { result, storage } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(storage.commands.insertSchema).toHaveBeenCalledTimes(1);

    const [{ version, pluginsMetadata }] = storage.commands.insertSchema.mock.calls[0];

    expect(version).toEqual(NEW_VERSION);
    expect(pluginsMetadata).toEqual({ [SOME_METADATA_NAME]: SOME_METADATA });
  });

  it('should assign a new version to the services using versioning strategy from options', async () =>
  {
    const { result, versioning } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(versioning.createVersion).toHaveBeenCalledTimes(1);
    expect(versioning.createVersion).toHaveBeenCalledWith({ currentVersion: STABLE_VERSION });
  });

  it('should return failure if versioning returns failure', async () =>
  {
    const { result, versioning } = await executeHandler({ versioning: createFailedFakeVersioning() });

    expect(result).toBeFailed();
    expect(versioning.createVersion).toHaveBeenCalledTimes(1);
    expect(versioning.createVersion).toHaveBeenCalledWith({ currentVersion: STABLE_VERSION });
  });

  it('should return failure and release lock if services could not be inserted', async () =>
  {
    const { storage, result, locking } = await executeHandler({
      storage: {
        commands: {
          insertSchema: jest.fn().mockResolvedValue({ success: false, error: 'some error' })
        }
      }
    });

    expect(result).toBeFailed();
    expect(storage.commands.insertSchema).toHaveBeenCalledTimes(1);
    expect(locking.releaseLock).toHaveBeenCalledTimes(1);
  });

  it('should return new schema version', async () =>
  {
    const { result } = await executeHandler();

    expect(result).toBeSuccessful();
    expect(result.payload).toEqual({
      lock: {
        id: LOCK_ID,
        status: LOCK_STATUS.ACQUIRED
      },
      version: NEW_VERSION
    });

  });
});