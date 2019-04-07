import { mergeSchemas } from 'graphql-tools';

const convertMetadataItem = (metadataItem) => ({
  ...metadataItem,
  arguments: metadataItem.arguments.map(arg => ({
    ...arg,
    value: JSON.parse(arg.value)
  }))
});

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

      result[name].push(convertMetadataItem(metadataItem));
    }
  }

  return result;
};

const getSchemas = (servicesHash) => Object.keys(servicesHash).map(k => servicesHash[k].schema);

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

  getTransformedClientSchema = () => mergeSchemas({ schemas: getSchemas(this.servicesHash) });


  // means getServicesMetadata, todo: refactor this name!
  getMetadata = ({ name }) => this.servicesMetadata[name] || [];
}