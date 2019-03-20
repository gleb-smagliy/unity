import { effects } from "../../../common-modules/saga-runner";
import { buildingNewServiceSaga } from "./building-new-service-saga";
import { buildingServicesHashByTagSaga } from './building-services-hash-saga';
import { transformServices } from "../../modules/services";
import { insertingServicesSaga } from './inserting-services-saga';
import { SYSTEM_TAGS } from '../constants/system-tags';

export function* registrationSaga({
  command,
  options: configOptions,
  extractPluginsMetadata
})
{
  const { schemaBuilders, versioning, serviceSchemaTransformers, storage } = configOptions;
  const { id: serviceId, schemaBuilder: schemaBuilderName, options: builderOptions } = command;
  const serviceDefinition = { id: serviceId, options: builderOptions };

  const upsert = yield effects.call(buildingNewServiceSaga, { serviceDefinition, schemaBuilders, schemaBuilderName });

  const transform = yield effects.call(transformServices, serviceSchemaTransformers);

  const servicesHash = yield effects.call(buildingServicesHashByTagSaga, { tag: SYSTEM_TAGS.STABLE, upsert, transform, storage });

  const pluginsMetadata = yield effects.call(extractPluginsMetadata, servicesHash);

  const { version: newVersion } = yield effects.call(insertingServicesSaga, { storage, versioning, servicesHash, pluginsMetadata });

  return {
    success: true,
    payload: {
      version: newVersion
    }
  }
}