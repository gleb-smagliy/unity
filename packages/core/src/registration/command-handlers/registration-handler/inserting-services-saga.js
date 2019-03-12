import { effects } from "../../../common-modules/saga-runner";
import { buildInsertSchemaCommand } from "../../../data";

export function* insertingServicesSaga({ storage, versioning, servicesHash, pluginsMetadata })
{
  const currentVersion = servicesHash.getVersion();

  const insertSchema = yield effects.call(buildInsertSchemaCommand, storage.commands);
  const { version } = yield effects.call(versioning.createVersion, { currentVersion });

  yield effects.call(insertSchema, {
    version,
    services: servicesHash.getServicesList(),
    metadata: pluginsMetadata
  });

  return {
    success: true,
    payload: {
      version
    }
  }
}