import { lockBarrier } from "../../modules/locking";
import {  extractMetadataForPlugins } from "../../modules/plugins";
import { buildServicesByTagQuery, buildInsertSchemaCommand } from '../../../data';
import { runSaga } from "../../../common-modules/saga-runner";
import { registrationSaga } from './registration-saga';

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
    this.withLock = lockBarrier(options.locking);
    this.insertSchema = buildInsertSchemaCommand(options.storage.commands);
  }

  execute = async (command) =>
  {
    const { id: serviceId } = command;

    const saga = registrationSaga({
      command,
      options: this.options,
      extractPluginsMetadata: this.extractPluginsMetadata,
      insertSchema: this.insertSchema
    });

    return this.withLock(serviceId, async () => await runSaga(saga))};

  extractPluginsMetadata = async (servicesHash) => await extractMetadataForPlugins({
    plugins: [ ...this.options.extensionBuilders, ...this.options.gatewaySchemaTransformers ],
    args: [servicesHash]
  });
}