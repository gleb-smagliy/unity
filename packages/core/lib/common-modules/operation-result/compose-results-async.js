"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeResultsAsync = void 0;

const composeResultsAsync = async (...promises) => await Promise.all(promises).then(results => {
  const failedResult = results.find(r => !r.success);

  if (failedResult) {
    return failedResult;
  }

  return {
    success: true,
    payload: results.map(r => r.payload)
  };
});

exports.composeResultsAsync = composeResultsAsync;