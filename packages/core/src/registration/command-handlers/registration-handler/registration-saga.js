import { effects } from "../../../common-modules/saga-runner";
import { findSchemaBuilder } from "../../../common-modules/plugins";
import { buildServicesHash, transformServices } from "../../modules/services";
import { buildServicesByTagQuery, buildInsertSchemaCommand } from '../../../data';
import { SYSTEM_TAGS } from './system-tags';

function* buildNewService({ serviceDefinition, schemaBuilders, schemaBuilderName })
{
  const schemaBuilder = yield effects.call(findSchemaBuilder, schemaBuilders, schemaBuilderName);
  const builtService = yield effects.call(schemaBuilder.buildServiceModel, serviceDefinition);
  const serviceMetadata = yield effects.call(schemaBuilder.extractMetadata, serviceDefinition);

  return {
    success: true,
    payload: {
      schema: builtService.schema,
      metadata: serviceMetadata.metadata,
      id: serviceDefinition.id
    }
  };
}

function* buildServicesHashByTag({ tag, upsert, transform, storage })
{
  const getServicesByTag = buildServicesByTagQuery(storage.queries);

  const { version, services } = yield effects.call(getServicesByTag, { tag: SYSTEM_TAGS.STABLE });

  const servicesHash = yield effects.call(buildServicesHash, {
    services,
    version,
    upsert,
    transform
  });

  servicesHash.setPluginsMetadata(servicesHash);

  return {
    success: true,
    payload: servicesHash
  }
}

export function* registrationSaga({
  command,
  options: configOptions,
  extractPluginsMetadata,
  insertSchema
})
{
  const { schemaBuilders, versioning, serviceSchemaTransformers, storage } = configOptions;
  const { id: serviceId, schemaBuilder: schemaBuilderName, options: builderOptions } = command;
  const serviceDefinition = { id: serviceId, options: builderOptions };

  const upsert = yield effects.call(buildNewService, { serviceDefinition, schemaBuilders, schemaBuilderName });

  const transform = yield effects.call(transformServices, serviceSchemaTransformers);

  const servicesHash = yield effects.call(buildServicesHashByTag, { tag: SYSTEM_TAGS.STABLE, upsert, transform, storage });

  const pluginsMetadata = yield effects.call(extractPluginsMetadata, servicesHash);

  const { version: newVersion } = versioning.createVersion({ currentVersion: servicesHash.getVersion() });

  yield effects.call(insertSchema, {
    version: newVersion,
    services: servicesHash.getServicesList(),
    metadata: pluginsMetadata
  });

  return {
    success: true,
    payload: {
      version: newVersion
    }
  }
}