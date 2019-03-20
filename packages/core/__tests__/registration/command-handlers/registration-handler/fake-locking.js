import { LOCK_STATUS, LOCK_STATE } from "../../../../src/registration/modules/locking";

export const LOCK_ID = '123';

export const createSuccessfulLocking = () => ({
  acquireLock: jest.fn().mockResolvedValue({ success: true, payload: { status: LOCK_STATUS.ACQUIRED, id: LOCK_ID }}),
  getLockState: jest.fn().mockResolvedValue({ success: true, payload: LOCK_STATE.ACQUIRED }),
  releaseLock: jest.fn().mockResolvedValue({ success: true })
});