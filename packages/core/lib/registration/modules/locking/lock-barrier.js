"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lockBarrier = exports.LOCK_STATUS = void 0;
const LOCK_STATUS = {
  ACQUIRED: 'ACQUIRED',
  ALREADY_LOCKED: 'ALREADY_LOCKED',
  FAILURE: 'FAILURE'
};
exports.LOCK_STATUS = LOCK_STATUS;

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

const lockBarrier = ({
  acquireLock,
  releaseLock
}) => async (lockId, func) => {
  const acquireLockResult = await acquireLock({
    id: lockId
  });

  if (!acquireLockResult.success) {
    return acquireLockResult;
  }

  if (acquireLockResult.payload.status === LOCK_STATUS.ALREADY_LOCKED) {
    return successWithLockStatus(acquireLockResult.payload);
  }

  const funcResult = await func();

  if (!funcResult.success) {
    const releaseLockResult = await releaseLock();

    if (!releaseLockResult.success) {
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

exports.lockBarrier = lockBarrier;