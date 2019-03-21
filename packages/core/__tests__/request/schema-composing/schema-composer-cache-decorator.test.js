import { cacheDecorator } from "../../../src/request/schema-composing/schema-composer-cache-decorator";

const version = 'abcd-efdf';
const args = { sccdArg1: 'arg1_value_sccd' };
const otherVersion = 'abcd-efdf-1111';

const successfulResult = (payload) => ({ success: true, payload });
const failedResult = () => ({ success: false, error: 'unknown err' });

const SCHEMA = { types: [1,2,3]};

const createCache = (success) => ({
  tryGetItem: jest.fn().mockReturnValue(success ? successfulResult(SCHEMA) : failedResult()),
  setItem: jest.fn()
});

const createComposer = (success) => jest.fn().mockResolvedValue(success ? successfulResult(SCHEMA) : failedResult());

describe('cacheDecorator', () =>
{
  it('should call composeSchema with version if schema is not in cache', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version, args });

    expect(composeSchema).toHaveBeenCalledWith({ version, args });
  });

  it('should call composeSchema with version if schema is in cache but other version is requested', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version, args });
    await composer({ version: otherVersion, args });

    expect(composeSchema).toHaveBeenCalledWith({ version, args });
    expect(composeSchema).toHaveBeenCalledWith({ version: otherVersion, args });
    expect(composeSchema).toHaveBeenCalledTimes(2);
  });

  it('should not call composeSchema if schema is in cache', async () =>
  {
    const schemasCache = createCache(true);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version, args });

    expect(composeSchema).not.toHaveBeenCalled();
  });

  it('should return schema from cache if schema is in cache', async () =>
  {
    const schemasCache = createCache(true);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    const result = await composer({ version, args });

    expect(result).toBeSuccessful(SCHEMA);
  });

  it('should call tryGetItem on cache with version', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    const args = { a: '1' };
    const version = '123';
    const key = '123|a|1';

    await composer({ version, args });

    expect(schemasCache.tryGetItem).toHaveBeenCalledWith(key);
  });

  it('should call setItem on cache with version and composed schema', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    const args = { a: '1' };
    const version = '123';
    const key = '123|a|1';

    await composer({ version, args });

    expect(schemasCache.setItem).toHaveBeenCalledWith(key, SCHEMA);
  });

  it('should not call setItem on cache if schema failed to compose', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(false);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version, args });

    expect(schemasCache.setItem).not.toHaveBeenCalled();
  });

  it('should return failure if schema failed to compose', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(false);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    const result = await composer({ version, args });

    expect(result).toBeFailed();
  });
});