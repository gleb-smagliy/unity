import { transformSchema } from 'graphql-tools';
import { tryGetName } from "../../plugins/utils/get-plugin-name";
import { buildCompositeServicesTransformer } from "../../request/schema-composing/executable-schema-composer/build-composite-service-transformer";

export const LOCK_STATUS = {
  ACQUIRED: 'ACQUIRED',
  ALREADY_LOCKED: 'ALREADY_LOCKED',
  FAILURE: 'FAILURE'
};

export const SYSTEM_TAGS = {
  STABLE: 'stable'
};

const successWithLockStatus = (lockPayload, payload) => ({
  success: true,
  payload: {
    lock: {
      id: lockPayload.id,
      time: lockPayload.time,
      status: lockPayload.status
    },
    ...payload
  }
});

const toServicesDict = ({ services, upsert }) =>
{
  const fullServicesList = [
    ...services,
    upsert
  ];

  return fullServicesList
    .reduce((acc, service) => ({ ...acc, [service.id]: service }), {});
};

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
    this.getServiceTransforms = buildCompositeServicesTransformer(options.serviceSchemaTransformers);
  }

  execute = async (command) =>
  {
    const { id: serviceId } = command;

    return this.useLock(serviceId, async () => await this.executeImplementation(command));
  };

  executeImplementation = async (command) =>
  {
    const {
      storage: {
        queries: {
          getVersionByTag,
          getServicesByVersion
        }
      }
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

    const buildServiceResult = await schemaBuilder.buildServiceModel(serviceDefinition);

    if(!buildServiceResult.success)
    {
      return buildServiceResult;
    }

    const newService = { ...buildServiceResult.payload, id: serviceId };

    const stableVersionResult = await getVersionByTag({ tag: SYSTEM_TAGS.STABLE });

    if(!stableVersionResult.success)
    {
      return stableVersionResult;
    }

    const servicesResult = await getServicesByVersion({ version: stableVersionResult.payload });

    if(!servicesResult.success)
    {
      return servicesResult;
    }

    const extractMetadataResult = await schemaBuilder.extractMetadata(serviceDefinition);

    if(!extractMetadataResult.success)
    {
      return extractMetadataResult;
    }

    const services = toServicesDict({
      services: servicesResult.payload,
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

    return {
      success: true
    }
  };

  useLock = async (lockId, func) =>
  {
    const {
      locking: { acquireLock, releaseLock }
    } = this.options;

    const acquireLockResult = await acquireLock({ id: lockId });

    if(!acquireLockResult.success)
    {
      return acquireLockResult;
    }

    if(acquireLockResult.payload.status === LOCK_STATUS.ALREADY_LOCKED)
    {
      return successWithLockStatus(acquireLockResult.payload);
    }

    const funcResult = await func();

    if(!funcResult.success)
    {
      const releaseLockResult = await releaseLock();

      if(!releaseLockResult.success)
      {
        return {
          success: false,
          error: `Could not release lock (ERROR: <${releaseLockResult.error}>) while rollbacking due to: <${funcResult.error}>`
        };
      }
    }

    return funcResult;
  };
}