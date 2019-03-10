import { transformSchema } from 'graphql-tools';
import { tryGetName } from "../../plugins/utils/get-plugin-name";
import { extractMetadataForPlugins } from './extract-metadata-for-plugins';
import { buildCompositeServicesTransformer } from "../../request/schema-composing/executable-schema-composer/build-composite-service-transformer";
import { lockBarrier } from "./lock-barrier";
import { composeResultsAsync } from './compose-results-async';
import { toServicesHash } from './to-services-hash'
import { buildServicesByTagQuery } from './services-by-tag-query';

export const SYSTEM_TAGS = {
  STABLE: 'stable'
};

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
    this.getServiceTransforms = buildCompositeServicesTransformer(options.serviceSchemaTransformers);
    this.withLock = lockBarrier(options.locking);
    this.getServicesByTag = buildServicesByTagQuery(options.storage.queries);
  }

  execute = async (command) =>
  {
    const { id: serviceId } = command;

    return this.withLock(serviceId, async () => await this.executeImplementation(command));
  };

  executeImplementation = async (command) =>
  {
    const {
      storage: {
        commands: {
          insertServices,
          insertMetadata
        }
      },
      extensionBuilders,
      gatewaySchemaTransformers,
      versioning
    } = this.options;

    const { id: serviceId, schemaBuilder: schemaBuilderName, options } = command;
    const schemaBuilder = this.options.schemaBuilders.find(b => tryGetName(b).payload === schemaBuilderName);

    if(!schemaBuilder)
    {
      return {
        success: false,
        error: `Specified schema builder ${schemaBuilderName} is not in options`
      };
    }

    const serviceDefinition = { id: serviceId, options };

    const schemaResult = await composeResultsAsync(
      schemaBuilder.buildServiceModel(serviceDefinition),
      schemaBuilder.extractMetadata(serviceDefinition),
      this.getServicesByTag({ tag: SYSTEM_TAGS.STABLE }),
    );

    if(!schemaResult.success)
    {
      return schemaResult;
    }

    const [
      builtService,
      serviceMetadata,
      { version: stableVersion, services: stableServices }
    ] = schemaResult.payload;

    const newService = {
      schema: builtService.schema,
      metadata: serviceMetadata.metadata,
      id: serviceId
    };

    const services = toServicesHash({
      services: stableServices,
      upsert: newService
    });

    const transformsResult = this.getServiceTransforms({ services: Object.values(services) });

    if(!transformsResult.success)
    {
      return transformsResult;
    }

    for (let key of Object.keys(services))
    {
      const service = services[key];

      services[key] = {
        ...service,
        transformedSchema: transformSchema(service.schema, transformsResult.payload[key])
      };
    }

    // todo: implement servicesCollection after it's API is defined
    const servicesCollection = {};
    const metadataExtraction = await extractMetadataForPlugins({
      plugins: [ ...extensionBuilders, ...gatewaySchemaTransformers ],
      args: [servicesCollection]
    });

    if(!metadataExtraction.success)
    {
      return metadataExtraction;
    }

    const metadata = metadataExtraction.payload;

    const { version: newVersion } = versioning.createVersion({ currentVersion: stableVersion });

    const insertServicesResult = await insertServices({
      version: newVersion,
      services: Object.values(services)
    });

    const insertMetadataResult = await insertMetadata({
      version: newVersion,
      metadata
    });

    if(!insertMetadataResult.success)
    {
      return insertMetadataResult;
    }

    if(!insertServicesResult.success)
    {
      return insertServicesResult;
    }

    return {
      success: true,
      payload: {
        version: newVersion
      }
    }
  };
}