class ServicesHash
{
  constructor({ servicesHash, version })
  {
    this.servicesHash = servicesHash;
    this.version = version;
  }

  getServicesList = () =>
  {
    return Object.values(this.servicesHash);
  };

  getVersion = () =>
  {
    return this.version;
  };

  // pluginsMetadata: {[string]: any}
  setPluginsMetadata = (pluginsMetadata) =>
  {
    this.pluginsMetadata = pluginsMetadata;
  };
}


const servicesReducer = (hash, service) => ({
  ...hash,
  [service.id]: service
});

export const buildServicesHash = ({
  services,
  version,
  upsert,
  transform
}) =>
{
  const fullServicesList = [
    ...services,
    upsert
  ];

  const hashingServices = transform(
    fullServicesList.reduce(servicesReducer, {})
  );

  if(!hashingServices.success)
  {
    return hashingServices;
  }

  const servicesHash = hashingServices.payload;

  return {
    success: true,
    payload: new ServicesHash({ servicesHash, version })
  }
};