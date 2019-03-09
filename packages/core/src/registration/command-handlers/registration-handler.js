import { tryGetName } from "../../plugins/utils/get-plugin-name";

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

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
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