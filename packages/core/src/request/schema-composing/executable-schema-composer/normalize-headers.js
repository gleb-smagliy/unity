const omitHeaders = [
  'accept',
  'accept-encoding',
  'accept-Language',
  'connection',
  'content-length',
  'content-type',
  'cookie',
  'host',
  'origin',
  'referer',
  'user-agent'
];


export const normalizeHeaders = (headers = {}) => Object
  .keys(headers)
  .reduce((result, header) =>
  {
    const lowerCasedHeader = header.toLowerCase();

    if(omitHeaders.indexOf(lowerCasedHeader) === -1)
    {
      result[lowerCasedHeader] = headers[header];
    }

    return result;
  }, {});