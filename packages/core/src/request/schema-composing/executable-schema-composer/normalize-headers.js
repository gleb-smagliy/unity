export const normalizeHeaders = (headers = {}) => Object
  .keys(headers)
  .reduce((acc, cur) =>
  {
    acc[cur.toLowerCase()] = headers[cur];

    return acc;
  }, {});