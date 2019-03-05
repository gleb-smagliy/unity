import { getSchemaVersion } from "../../../src/request/data";

describe('getSchemaVersion', () =>
{
  const version = 'abcd';

  it('should return failure if both version and tag are null', async () =>
  {
    const version = null;
    const tag = null;

    const result = await getSchemaVersion({ version, tag });

    expect(result).toBeFailed();
  });

  it('should return failure if version and tag are null and undefined', async () =>
  {
    const version = null;
    const tag = undefined;

    const result = await getSchemaVersion({ version, tag });

    expect(result).toBeFailed();
  });

  it('should return failure if version and tag are undefined and null', async () =>
  {
    const version = undefined;
    const tag = null;

    const result = await getSchemaVersion({ version, tag });

    expect(result).toBeFailed();
  });

  it('should return failure if version and tag are object and number', async () =>
  {
    const version = {};
    const tag = 123;

    const result = await getSchemaVersion({ version, tag });

    expect(result).toBeFailed();
  });

  it('should return failure if version is invalid and version cannot be retrieved by tag', async () =>
  {
    const version = {};
    const tag = 'v1';

    const getVersionByTag = jest.fn().mockResolvedValue({ success: false, error: 'unknown error' });
    const result = await getSchemaVersion({ version, tag, getVersionByTag });

    expect(result).toBeFailed();
  });

  it('should return success if version is invalid and version can be retrieved by tag', async () =>
  {
    const version = {};
    const tag = 'v1';
    const payload = 'zxcv-bnmq';

    const getVersionByTag = jest.fn().mockResolvedValue({ success: true, payload });
    const result = await getSchemaVersion({ version, tag, getVersionByTag });

    expect(result).toBeSuccessful(payload);
  });
});