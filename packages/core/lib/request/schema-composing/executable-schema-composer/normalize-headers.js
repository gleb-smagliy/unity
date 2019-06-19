"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeHeaders = void 0;
const omitHeaders = ['accept', 'accept-encoding', 'accept-Language', 'connection', 'content-length', 'content-type', 'cookie', 'host', 'origin', 'referer', 'user-agent'];

const normalizeHeaders = (headers = {}) => Object.keys(headers).reduce((result, header) => {
  const lowerCasedHeader = header.toLowerCase();

  if (omitHeaders.indexOf(lowerCasedHeader) === -1) {
    result[lowerCasedHeader] = headers[header];
  }

  return result;
}, {});

exports.normalizeHeaders = normalizeHeaders;