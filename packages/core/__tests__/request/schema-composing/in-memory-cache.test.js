import { InMemoryCache } from "../../../src/request/schema-composing/in-memory-cache";

describe('InMemoryCache', () =>
{
  it('tryGetItem should return failure if cache is empty', async () =>
  {
    const cache = new InMemoryCache();

    const result = cache.tryGetItem('some_key');

    expect(result).toBeFailed();
  });

  it('tryGetItem should return success with item payload after adding item to cache', async () =>
  {
    const key = 'some_key';
    const item = { schema: { field: 123 }};

    const cache = new InMemoryCache();

    cache.setItem(key, item);

    const result = cache.tryGetItem(key);

    expect(result).toBeSuccessful(item);
  });
});