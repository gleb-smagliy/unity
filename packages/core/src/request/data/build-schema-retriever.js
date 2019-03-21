import { mapServices } from './map-services';

export const buildSchemaRetriever = (options) =>
{
  const { storage: { queries: { getSchemaByVersion } } } = options;

  return async ({ version, args = {} }) =>
  {
    const schemaResult = await getSchemaByVersion({ version });

    if(!schemaResult.success)
    {
      return schemaResult;
    }

    const servicesResult = mapServices(schemaResult.payload.services, args);

    if(!servicesResult.success)
    {
      return servicesResult;
    }

    return {
      success: true,
      payload: {
        services: servicesResult.payload,
        pluginsMetadata: schemaResult.payload.pluginsMetadata
      }
    };
  };
};