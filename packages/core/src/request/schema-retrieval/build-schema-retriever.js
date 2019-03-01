const handleResults = (results) =>
{
  const [servicesResult, metadataResult] = results;

  if(!servicesResult.success)
  {
    return {
      success: false,
      error: servicesResult.error
    };
  }

  if(!metadataResult.success)
  {
    return {
      success: false,
      error: metadataResult.error
    };
  }

  return {
    success: true,
    payload: {
      services: servicesResult.payload,
      metadata: metadataResult.payload
    }
  };
};

export const buildSchemaRetriever = (options) =>
{
  const { storage: { getServicesByVersion, getMetadataByVersion } } = options;

  return async ({ version }) =>
  {
      const servicesPromise = getServicesByVersion({ version });
      const metadataPromise = getMetadataByVersion({ version });

      const promises = Promise.all([servicesPromise, metadataPromise]);

      return promises.then(handleResults);
  };
};