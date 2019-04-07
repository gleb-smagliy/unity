const getMetadata = services =>
{
  const serviceKeys = Object.keys(services);
  const result = {};

  for(let key of serviceKeys)
  {
    const service = services[key];

    const { metadata = [] } = service;

    for(let metadataItem of metadata)
    {
      const name = metadataItem.name;

      if(!result[name])
      {
        result[name] = [];
      }

      result[name].push(metadataItem);
    }
  }

  return result;
};


export class ServicesHash
{
  constructor({ servicesHash, version })
  {
    this.servicesHash = servicesHash;
    this.version = version;

    this.servicesMetadata = getMetadata(servicesHash);
  }

  getServicesList = () =>
  {
    return Object.values(this.servicesHash);
  };

  getVersion = () =>
  {
    return this.version;
  };

  // // pluginsMetadata: {[string]: any}
  // setPluginsMetadata = (pluginsMetadata) =>
  // {
  //   this.pluginsMetadata = pluginsMetadata;
  // };

  getTransformedClientSchema = () => null;


  // means getServicesMetadata, todo: refactor this name!
  getMetadata =({ name }) => this.servicesMetadata[name];
}