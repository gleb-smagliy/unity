import {  SchemaVersionTaggingHandler } from '../../../../src/registration/command-handlers/schema-version-taging-handler/schema-version-taging-handler';
import { createSuccessfulStorage } from '../../../fake-storage'

const version = '1';
const tag = 'alpha';
const args = { arg1: 'arg1_value' };

describe('ServiceVersionTaggingCommandHander', () =>
{
  it('should check if there are services of specified version using storage', async () =>
  {
    const storage = createSuccessfulStorage();

    const handler = new SchemaVersionTaggingHandler({ storage });

    const result = await handler.execute({ version, tag, args });

    expect(result).toBeSuccessful();
    expect(storage.queries.getSchemaByVersion).toHaveBeenCalledWith({ version });
  });

  it('should return failure if getting services from storage returns failure', async () =>
  {
    const storage = createSuccessfulStorage();
    const getSchemaByVersion = jest.fn().mockResolvedValue({ success: false, error: 'some err' });
    const handler = new SchemaVersionTaggingHandler({
      storage: {
        ...storage,
        queries: { ...storage.queries, getSchemaByVersion }
      }
    });

    const result = await handler.execute({ version, tag, args });

    expect(result).toBeFailed();
    expect(getSchemaByVersion).toHaveBeenCalledWith({ version });
  });

  it('should set specified tag to the version using storage', async () =>
  {
    const storage = createSuccessfulStorage();
    const handler = new SchemaVersionTaggingHandler({ storage });

    const result = await handler.execute({ version, tag, args });

    expect(result).toBeSuccessful();
    expect(storage.commands.upsertTag).toHaveBeenCalledWith({ version, tag, args });
  });

  it('should not call storage.upsertTag and return failure if there are no services of specified version', async () =>
  {
    const storage = createSuccessfulStorage();

    const getSchemaByVersion = jest.fn().mockResolvedValue({ success: true, payload: { services: [] }});
    const upsertTag = jest.fn().mockResolvedValue({ success: false, error: 'some err' });
    const handler = new SchemaVersionTaggingHandler({
      storage: {
        ...storage,
        queries: { ...storage.queries, getSchemaByVersion },
        commands: { ...storage.commands, upsertTag }
      }
    });

    const result = await handler.execute({ version, tag, args });

    expect(result).toBeFailed();
    expect(upsertTag).not.toHaveBeenCalled();
  });

  it('should return failure if storage.upsertTag returns failure', async () =>
  {
    const storage = createSuccessfulStorage();
    const upsertTag = jest.fn().mockResolvedValue({ success: false, error: 'some err' });
    const handler = new SchemaVersionTaggingHandler({
      storage: {
        ...storage,
        commands: { ...storage.commands, upsertTag }
      }
    });

    const result = await handler.execute({ version, tag, args });

    expect(result).toBeFailed();
  });
});