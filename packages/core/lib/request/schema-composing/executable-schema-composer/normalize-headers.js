"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeHeaders = void 0;
const DEFAULT_OMIT_HEADERS = ['accept', 'accept-encoding', 'accept-Language', 'connection', 'content-length', 'content-type', 'cookie', 'host', 'origin', 'referer', 'user-agent'];
const SOYUZ_HEADER = 'x-soyuz';

const normalizeHeaders = (headers = {}, exclude = []) => {
  // console.log('normalizeHeaders::headers:', headers);
  const omitHeaders = [...DEFAULT_OMIT_HEADERS, ...exclude.map(h => h.toLowerCase())];
  return Object.keys(headers).reduce((result, header) => {
    const lowerCasedHeader = header.toLowerCase(); // console.log('lowerCasedHeader1:', lowerCasedHeader);

    if (omitHeaders.indexOf(lowerCasedHeader) === -1 && !lowerCasedHeader.startsWith(SOYUZ_HEADER)) {
      // console.log('lowerCasedHeader2:', lowerCasedHeader);
      result[lowerCasedHeader] = headers[header];
    }

    return result;
  }, {});
};

exports.normalizeHeaders = normalizeHeaders;