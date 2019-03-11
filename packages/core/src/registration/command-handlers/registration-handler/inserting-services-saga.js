import { effects } from "../../../common-modules/saga-runner";
import { buildInsertSchemaCommand } from "../../../data";

export function* insertingServicesSaga({ storage, versioning, servicesHash, pluginsMetadata })
{
  const insertSchema = yield effects.call(buildInsertSchemaCommand, storage.commands);

  const { version } = versioning.createVersion({ currentVersion: servicesHash.getVersion() });

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