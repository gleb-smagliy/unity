import { RegistrationCommitingHandler } from '../../../../src/registration/command-handlers/registration-commiting-handler/registration-commiting-handler';
import { LOCK_STATUS, LOCK_STATE } from "../../../../src/registration/modules/locking";
import { SYSTEM_TAGS } from '../../../../src/registration/command-handlers/constants/system-tags';
import { createSuccessfulLocking } from "../registration-handler/fake-locking";

const version = 'test';
const stage = 'prod';

describe('RegistrationCommitingHandler', () =>
{
  it('should call VersionTaggingHandler with passed version and STABLE tag', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaVersionTaggingHandler = {
      execute: jest.fn().mockResolvedValue({ success: true })
    };

    const handler = new RegistrationCommitingHandler({ schemaVersionTaggingHandler }, { locking });

    const result = await  handler.execute({ version, stage });

    expect(result).toBeSuccessful();
    expect(schemaVersionTaggingHandler.execute).toHaveBeenCalledWith({ version, tag: SYSTEM_TAGS.STABLE, stage });
  });

  it('should return failure if VersionTaggingHandler returns failure', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaVersionTaggingHandler = {
      execute: jest.fn().mockResolvedValue({ success: false, error: 'some err' })
    };

    const handler = new RegistrationCommitingHandler({ schemaVersionTaggingHandler }, { locking });

    const result = await  handler.execute({ version, stage });

    expect(result).toBeFailed();
    expect(schemaVersionTaggingHandler.execute).toHaveBeenCalledWith({ version, tag: SYSTEM_TAGS.STABLE, stage });
  });

  it('should return failure and do not tag schema version if lock is not acquired', async () =>
  {
    const locking = {
      ...createSuccessfulLocking(),
      getLockState: jest.fn().mockResolvedValue({ success: true, payload: LOCK_STATE.NOT_ACQURIED })
    };
    const schemaVersionTaggingHandler = {
      execute: jest.fn().mockResolvedValue({ success: true })
    };

    const handler = new RegistrationCommitingHandler({ schemaVersionTaggingHandler }, { locking });

    const result = await  handler.execute({ version, stage });

    expect(result).toBeFailed();
    expect(schemaVersionTaggingHandler.execute).not.toHaveBeenCalled();
  });

  it('should release lock if commit is successful', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaVersionTaggingHandler = {
      execute: jest.fn().mockResolvedValue({ success: true })
    };

    const handler = new RegistrationCommitingHandler({ schemaVersionTaggingHandler }, { locking });

    const result = await  handler.execute({ version, stage });

    expect(result).toBeSuccessful();
    expect(locking.releaseLock).toHaveBeenCalledWith();
  });

  it('should not release lock if VersionTaggingHandler returns failure', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaVersionTaggingHandler = {
      execute: jest.fn().mockResolvedValue({ success: false, error: 'some err' })
    };

    const handler = new RegistrationCommitingHandler({ schemaVersionTaggingHandler }, { locking });

    const result = await  handler.execute({ version, stage });

    expect(result).toBeFailed();
    expect(schemaVersionTaggingHandler.execute).toHaveBeenCalledWith({ version, tag: SYSTEM_TAGS.STABLE, stage });
    expect(locking.releaseLock).not.toHaveBeenCalled();
  });

  it('should return lock state if commit is successful', async () =>
  {
    const locking = createSuccessfulLocking();
    const schemaVersionTaggingHandler = {
      execute: jest.fn().mockResolvedValue({ success: true })
    };

    const handler = new RegistrationCommitingHandler({ schemaVersionTaggingHandler }, { locking });

    const result = await  handler.execute({ version, stage });

    expect(result).toBeSuccessful();
    expect(schemaVersionTaggingHandler.execute).toHaveBeenCalledWith({ version, tag: SYSTEM_TAGS.STABLE, stage });
  });
});