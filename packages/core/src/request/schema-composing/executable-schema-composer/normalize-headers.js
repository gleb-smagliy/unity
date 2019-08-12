const DEFAULT_OMIT_HEADERS = [
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

const SOYUZ_HEADER = 'x-soyuz';

export const normalizeHeaders = (headers = {}, exclude = []) => Object
  .keys(headers)
  .reduce((result, header) =>
  {
    const omitHeaders = [
      ...DEFAULT_OMIT_HEADERS,
      ...exclude.map(h => h.toLowerCase())
    ];

    const lowerCasedHeader = header.toLowerCase();

    if(omitHeaders.indexOf(lowerCasedHeader) === -1 && !lowerCasedHeader.startsWith(SOYUZ_HEADER))
    {
      console.log('lowerCasedHeader:', lowerCasedHeader);

      result[lowerCasedHeader] = headers[header];
    }

    return result;
  }, {});