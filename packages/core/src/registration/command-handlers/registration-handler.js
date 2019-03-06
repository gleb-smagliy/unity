import { tryGetName } from "../../request/schema-composing/executable-schema-composer/get-plugin-name";

export const LOCK_STATUS = {
  ACQUIRED: 'ACQUIRED',
  ALREADY_LOCKED: 'ALREADY_LOCKED',
  FAILURE: 'FAILURE'
};

export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
  }

  execute = async (command) =>
  {
    const { locking: { acquireLock, releaseLock }} = this.options;

    const acquireLockResult = await acquireLock();

    if(!acquireLockResult.success)
    {
      return acquireLockResult;
    }

    if(acquireLockResult.payload.status === LOCK_STATUS.ALREADY_LOCKED)
    {
      return {
        success: false,
        error: 'Lock is already acquired'
      };
    }
    const { id, schemaBuilder: schemaBuilderName } = command;
    const schemaBuilder = this.options.schemaBuilders.find(b => tryGetName(b).payload === schemaBuilderName);

    if(!schemaBuilder)
    {
      const ERROR = `Specified schema builder ${schemaBuilderName} is not in options`;
      const releaseLockResult = await releaseLock();

      if(!releaseLockResult.success)
      {
        return {
          success: false,
          error: `Could not release lock (ERROR: <${releaseLockResult.error}>) while rollbacking due to: <${ERROR}>`
        };
      }

      return {
        success: false,
        error: ERROR
      }
    }
    // const { storage: { getServicesByVersion, getMetadataByVersion }} = this.options;


  }
}