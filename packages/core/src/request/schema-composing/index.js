import { InMemoryCache } from './in-memory-cache';
import { cacheDecorator } from './schema-composer-cache-decorator';
import { buildSchemaComposer as buildOriginalSchemaComposer } from "./schema-composer";

export const buildSchemaComposer = (options) =>
{
  const { cache: cacheOptions } = options;
  const originalSchemaComposer = buildOriginalSchemaComposer(options);

  if(typeof(cacheOptions) === 'object')
  {
    const inMemoryCache = !!cacheOptions ? new InMemoryCache(cacheOptions) : new InMemoryCache();

    return cacheDecorator({ composeSchema: originalSchemaComposer, schemasCache: inMemoryCache });
  }

  return originalSchemaComposer;
};