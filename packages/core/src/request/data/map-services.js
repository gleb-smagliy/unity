import { buildUri } from '../../common-modules/services'

export const mapServices = (services, args) =>
{
  const result = [];

  for (let service of services)
  {
    const uriArgs = {
      ...service.args,
      ...args
    };

    const endpointResult = buildUri(service.endpoint, uriArgs);

    if(!endpointResult.success)
    {
      return endpointResult;
    }

    result.push({
      ...service,
      endpoint: endpointResult.payload
    });
  }

  return {
    success: true,
    payload: result
  };
};