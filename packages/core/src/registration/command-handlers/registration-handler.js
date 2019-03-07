import { tryGetName } from "../../plugins/utils/get-plugin-name";

export const LOCK_STATUS = {
  ACQUIRED: 'ACQUIRED',
  ALREADY_LOCKED: 'ALREADY_LOCKED',
  FAILURE: 'FAILURE'
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
    const { id: serviceId, schemaBuilder: schemaBuilderName } = command;
    const schemaBuilder = this.options.schemaBuilders.find(b => tryGetName(b).payload === schemaBuilderName);

    if(!schemaBuilder)
    {
      return {
        success: false,
        error: `Specified schema builder ${schemaBuilderName} is not in options`
      };
    }

    return {
      success: true
    }
  };

  useLock = async (lockId, func) =>
  {
    const { locking: { acquireLock, releaseLock }} = this.options;
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