import { effects } from "../../saga-runner";
import { findSchemaBuilder } from "../../plugins/schema-builders/find-schema-builder";
import { buildServicesHash } from "./build-services-hash";
import { transformServices } from "./service-transformer";

export const SYSTEM_TAGS = {
  STABLE: 'stable'
};

export function* registrationSaga({
  command,
  options: configOptions,
  getServicesByTag,
  extractPluginsMetadata,
  insertSchema
})
{
  const { schemaBuilders, versioning, serviceSchemaTransformers } = configOptions;
  const { id: serviceId, schemaBuilder: schemaBuilderName, options } = command;

  const serviceDefinition = { id: serviceId, options };

  const schemaBuilder = yield effects.call(findSchemaBuilder, schemaBuilders, schemaBuilderName);

  const builtService = yield effects.call(schemaBuilder.buildServiceModel, serviceDefinition);

  const serviceMetadata = yield effects.call(schemaBuilder.extractMetadata, serviceDefinition);

  const { version, services } = yield effects.call(getServicesByTag, { tag: SYSTEM_TAGS.STABLE });

  const newService = {
    schema: builtService.schema,
    metadata: serviceMetadata.metadata,
    id: serviceId
  };

  const servicesHash = yield effects.call(buildServicesHash, {
    services,
    upsert: newService,
    transform: transformServices(serviceSchemaTransformers)
  });

  const pluginsMetadata = yield effects.call(extractPluginsMetadata, servicesHash);

  const { version: newVersion } = versioning.createVersion({ currentVersion: version });

  yield effects.call(insertSchema, {
    version: newVersion,
    services: Object.values(servicesHash),
    metadata: pluginsMetadata
  });

  return {
    success: true,
    payload: {
      version: newVersion
    }
  }
}