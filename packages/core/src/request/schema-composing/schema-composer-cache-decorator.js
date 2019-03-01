
export const cacheDecorator = ({ schemasCache, composeSchema }) => async ({ version }) =>
{
  const fromCacheResult = schemasCache.tryGetItem(version);

  if(fromCacheResult.success)
  {
    return fromCacheResult.payload;
  }

  const schema = composeSchema({ version });

  schemasCache.setItem(version, schema);

  return schema;
};