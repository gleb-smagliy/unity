import { cacheDecorator } from "../../../src/request/schema-composing/schema-composer-cache-decorator";

const version = 'abcd-efdf';

const successfulResult = (payload) => ({ success: true, payload });
const failedResult = () => ({ success: false, error: 'unknown err' });

const SCHEMA = { types: [1,2,3]};

const createCache = (success) => ({
  tryGetItem: jest.fn().mockReturnValue(success ? successfulResult(SCHEMA) : failedResult()),
  setItem: jest.fn()
});

const createComposer = (success) => jest.fn().mockReturnValue(success ? successfulResult(SCHEMA) : failedResult());

describe('cacheDecorator', () =>
{
  it('should call composeSchema with version if schema is not in cache', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version });

    expect(composeSchema).toHaveBeenCalledWith({ version });
  });

  it('should not call composeSchema if schema is in cache', async () =>
  {
    const schemasCache = createCache(true);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version });

    expect(composeSchema).not.toHaveBeenCalled();
  });

  it('should return schema from cache if schema is in cache', async () =>
  {
    const schemasCache = createCache(true);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    const result = await composer({ version });

    expect(result).toBeSuccessful(SCHEMA);
  });

  it('should call tryGetItem on cache with version', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version });

    expect(schemasCache.tryGetItem).toHaveBeenCalledWith(version);
  });

  it.only('should call setItem on cache with version and composed schema', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(true);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version });

    expect(schemasCache.setItem).toHaveBeenCalledWith(version, SCHEMA);
  });

  it.only('should not call setItem on cache if schema failed to compose', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(false);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    await composer({ version });

    expect(schemasCache.setItem).not.toHaveBeenCalled();
  });

  it.only('should return failure if schema failed to compose', async () =>
  {
    const schemasCache = createCache(false);
    const composeSchema = createComposer(false);

    const composer = cacheDecorator({ schemasCache, composeSchema });

    const result = await composer({ version });

    expect(result).toBeFailed();
  });
});