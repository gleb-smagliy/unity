export const LOCK_STATUS = {
  ACQUIRED: 'ACQUIRED',
  NOT_NEEDED: 'NOT_NEEDED',
  ALREADY_LOCKED: 'ALREADY_LOCKED',
  FAILURE: 'FAILURE'
};

export const LOCK_STATE = {
  ACQUIRED: 'ACQUIRED',
  NOT_NEEDED: 'NOT_NEEDED',
  NOT_ACQURIED: 'NOT_ACQURIED'
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

export const lockBarrier = ({ acquireLock, releaseLock }) => async (lockId, func) =>
{
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

    return funcResult;
  }

  const funcPayload = funcResult.payload;

  return successWithLockStatus(acquireLockResult.payload, funcPayload);
};