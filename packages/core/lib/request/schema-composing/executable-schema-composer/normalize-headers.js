"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeHeaders = void 0;

const normalizeHeaders = (headers = {}) => Object.keys(headers).reduce((acc, cur) => {
  acc[cur.toLowerCase()] = headers[cur];
  return acc;
}, {});

exports.normalizeHeaders = normalizeHeaders;