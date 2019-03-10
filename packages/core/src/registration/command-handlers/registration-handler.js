import { extractMetadataForPlugins } from './extract-metadata-for-plugins';
import { lockBarrier } from "./lock-barrier";
import { buildServicesByTagQuery } from './services-by-tag-query';
import { buildInsertSchemaCommand } from "./insert-schema-command";
import { runSaga } from "../../saga-runner";
import { registrationSaga } from './registration-saga';

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
    this.withLock = lockBarrier(options.locking);
    this.getServicesByTag = buildServicesByTagQuery(options.storage.queries);
    this.insertSchema = buildInsertSchemaCommand(options.storage.commands);
  }

  execute = async (command) =>
  {
    const { id: serviceId } = command;

    const saga = registrationSaga({
      command,
      options: this.options,
      extractPluginsMetadata: this.extractPluginsMetadata,
      transformServices: this.transformServices,
      getServicesByTag: this.getServicesByTag,
      insertSchema: this.insertSchema
    });

    return this.withLock(serviceId, async () => await runSaga(saga))};

  extractPluginsMetadata = async (servicesHash) => await extractMetadataForPlugins({
    plugins: [ ...this.options.extensionBuilders, ...this.options.gatewaySchemaTransformers ],
    args: [servicesHash]
  });
}