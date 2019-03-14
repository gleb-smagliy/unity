import { lockBarrier } from "../../modules/locking";
import {  extractMetadataForPlugins } from "../../modules/plugins";
import { runSaga } from "../../../common-modules/saga-runner";
import { registrationSaga } from './registration-saga';

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
    this.withLock = lockBarrier(options.locking);
  }

  execute = async (command) =>
  {
    const { id: serviceId } = command;

    const saga = registrationSaga({
      command,
      options: this.options,
      extractPluginsMetadata: this.extractPluginsMetadata,
    });

    return this.withLock(serviceId, async () => await runSaga(saga))};

  extractPluginsMetadata = async (servicesHash) => await extractMetadataForPlugins({
    plugins: [ ...this.options.extensionBuilders, ...this.options.gatewaySchemaTransformers ],
    args: [servicesHash]
  });
}