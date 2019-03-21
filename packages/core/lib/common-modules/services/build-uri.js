"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUri = void 0;

const toArg = key => `[${key}]`;

const uriReducer = args => (source, key) => source.replace(toArg(key), args[key]);

const buildUri = (sourceString, args = {}) => {
  const result = Object.keys(args).reduce(uriReducer(args), sourceString);

  if (result.indexOf('[') !== -1 || result.indexOf(']') !== -1) {
    return {
      success: false,
      error: `buildUri: <${sourceString}> transformed to <${result}>, but still contains placeholders`
    };
  }

  return {
    success: true,
    payload: result
  };
};

exports.buildUri = buildUri;