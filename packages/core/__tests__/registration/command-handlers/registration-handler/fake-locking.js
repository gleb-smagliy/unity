import { LOCK_STATUS } from "../../../../src/registration/modules/locking";

export const LOCK_ID = '123';

export const createSuccessfulLocking = () => ({
  acquireLock: jest.fn().mockResolvedValue({ success: true, payload: { status: LOCK_STATUS.ACQUIRED, id: LOCK_ID }}),
  isLockAcquired: jest.fn().mockResolvedValue({ success: true, payload: false }),
  releaseLock: jest.fn().mockResolvedValue({ success: true })
});