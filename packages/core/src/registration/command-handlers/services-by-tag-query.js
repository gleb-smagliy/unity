export const buildServicesByTagQuery = ({ getVersionByTag, getServicesByVersion }) => async ({ tag }) =>
{
  const versionResult = await getVersionByTag({ tag });

  if(!versionResult.success)
  {
    return versionResult;
  }

  const version = versionResult.payload;

  const servicesResult = await getServicesByVersion({ version });

  if(!servicesResult.success)
  {
    return servicesResult;
  }

  return {
    success: true,
    payload: {
      version,
      services: servicesResult.payload
    }
  }
};