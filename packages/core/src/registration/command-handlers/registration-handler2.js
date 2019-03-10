import { transformSchema } from 'graphql-tools';
import { tryGetName } from "../../plugins/utils/get-plugin-name";
import { extractMetadataForPlugins } from './extract-metadata-for-plugins';
import { buildServicesTransformer } from "./service-transformer";
import { lockBarrier } from "./lock-barrier";
import { composeResultsAsync } from './compose-results-async';
import { buildServicesHash } from './build-services-hash'
import { buildServicesByTagQuery } from './services-by-tag-query';
import { buildInsertSchemaCommand } from "./insert-schema-command";

export const SYSTEM_TAGS = {
  STABLE: 'stable'
};

const iterateSaga = async (saga) =>
{
  const generator = saga();

  let step = generator.next();
  let result = {
    success: true
  };

  while(!step.done)
  {
    const stepValue = step.value;

    let args = undefined;

    if(stepValue.operator === 'call')
    {
      const returned = stepValue.func(step.args);

      result = typeof(returned.then) === 'function' ? await returned : returned;

      if(!result.success)
      {
        return result;
      }

      args = result.payload;
    }

    step.next(args);
  }

  return {
    success: true,
    payload: result.payload
  }
};

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
    this.transformServices = buildServicesTransformer(options.serviceSchemaTransformers);
    this.withLock = lockBarrier(options.locking);
    this.getServicesByTag = buildServicesByTagQuery(options.storage.queries);
    this.insertSchema = buildInsertSchemaCommand(options.storage.commands);
  }

  execute = async (command) =>
  {
    const { id: serviceId } = command;

    return this.withLock(serviceId, async () => await this.executeImplementation(command));
  };

  executeImplementation = async (command) =>
  {
    const {
      extensionBuilders,
      gatewaySchemaTransformers,
      versioning
    } = this.options;

    const { id: serviceId, schemaBuilder: schemaBuilderName, options } = command;


    return compose(
      this.findSchemaBuilder(this.options.schemaBuilders, schemaBuilderName),
      this.
    );


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

    const servicesHashBuilding = buildServicesHash({
      services: stableServices,
      upsert: newService,
      transform: this.transformServices
    });

    if(!servicesHashBuilding.success)
    {
      return servicesHashBuilding;
    }

    const servicesHash = servicesHashBuilding.payload;

    // todo: implement servicesHash class after it's API is defined
    const metadataExtraction = await extractMetadataForPlugins({
      plugins: [ ...extensionBuilders, ...gatewaySchemaTransformers ],
      args: [servicesHash]
    });

    if(!metadataExtraction.success)
    {
      return metadataExtraction;
    }

    const { version: newVersion } = versioning.createVersion({ currentVersion: stableVersion });

    const insertSchemaResult = await this.insertSchema({
      version: newVersion,
      services: Object.values(servicesHash),
      metadata: metadataExtraction.payload
    });

    if(!insertSchemaResult.success)
    {
      return insertSchemaResult;
    }

    return {
      success: true,
      payload: {
        version: newVersion
      }
    }
  };
}