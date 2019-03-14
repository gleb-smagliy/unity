import { effects } from "../../../common-modules/saga-runner";

export function* insertingServicesSaga({ storage, versioning, servicesHash, pluginsMetadata })
{
  const { commands: { insertSchema } } = storage;
  const currentVersion = servicesHash.getVersion();

  const { version } = yield effects.call(versioning.createVersion, { currentVersion });

  yield effects.call(insertSchema, {
    version,
    services: servicesHash.getServicesList(),
    pluginsMetadata
  });

  return {
    success: true,
    payload: {
      version
    }
  }
}