import {createSuccessfulBuilder} from "./fake-schema-builders";
import {exampleServiceTransformer} from "../../../fake-plugins";
import {createSuccessfulLocking} from "./fake-locking";
import {createSuccessfulStorage} from "../../../fake-storage";
import {ServiceRegistrationCommandHander} from "../../../../src/registration/command-handlers/registration-handler";
import {RenameRootFields} from "graphql-tools";
import { GRAPHQL_COMMAND } from './graphql-command';
import { createSuccessfulExtractorPlugin } from './fake-extractor-plugins';
import { createFakeVersioning } from './fake-versioning';

export const SERVICE_TRANSFORMS = {
  User: [new RenameRootFields((operation, name) => `User_${name}`),]
};

export const executeHandler = async ({
  locking: lockingExtension,
  storage: { queries = {}, commands = {} } = {},
  schemaBuilders: originalBuilders = [createSuccessfulBuilder()],
  builderExtension = null,
  serviceSchemaTransformers = [exampleServiceTransformer({ success: true, transforms: SERVICE_TRANSFORMS })],
  extensionBuilders = [createSuccessfulExtractorPlugin()],
  gatewaySchemaTransformers = [createSuccessfulExtractorPlugin()],
  versioning = createFakeVersioning(),
  command = GRAPHQL_COMMAND
} = {}) =>
{
  const locking = {
    ...createSuccessfulLocking(),
    ...lockingExtension
  };

  const originalStorage = createSuccessfulStorage();

  const storage = {
    queries: {
      ...originalStorage.queries,
      ...queries
    },
    commands: {
      ...originalStorage.commands,
      ...commands
    }
  };

  const schemaBuilders = builderExtension ?
    [{ ...originalBuilders[0], ...builderExtension }] :
    originalBuilders;

  const handler = new ServiceRegistrationCommandHander({
    locking,
    storage,
    schemaBuilders,
    extensionBuilders,
    serviceSchemaTransformers,
    gatewaySchemaTransformers,
    versioning
  });

  return {
    result: await handler.execute(command),
    storage,
    locking,
    builder: schemaBuilders[0],
    serviceTransformers: serviceSchemaTransformers,
    extensionBuilders,
    gatewayTransformers: gatewaySchemaTransformers,
    versioning
  };
};