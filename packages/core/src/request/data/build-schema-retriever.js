export const buildSchemaRetriever = (options) =>
{
  const { storage: { queries: { getSchemaByVersion } } } = options;

  return async ({ version }) =>
  {
      const schemaResult = await getSchemaByVersion({ version });

      if(!schemaResult.success)
      {
        return schemaResult;
      }

      return {
        success: true,
        payload: {
          services: schemaResult.payload.services,
          pluginsMetadata: schemaResult.payload.pluginsMetadata
        }
      };
  };
};