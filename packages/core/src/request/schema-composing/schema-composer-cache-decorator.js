
export const cacheDecorator = ({ schemasCache, composeSchema }) => async ({ version }) =>
{
  const fromCacheResult = schemasCache.tryGetItem(version);

  if(fromCacheResult.success)
  {
    return fromCacheResult.payload;
  }

  const schemaComposition = composeSchema({ version });

  if(schemaComposition.success)
  {
    const schema = schemaComposition.payload;
    schemasCache.setItem(version, schema);

    return {
      success: true,
      payload: schema
    };
  }

  return schemaComposition;
};