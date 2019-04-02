"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeContextEnhancers = void 0;

/*
  Example:

  // in both cases enhancers are functions

  const headersEnhancers = ({ req }) => ({
    auth: 'foo'
  });

  const headersEnhancers = composeEnhancers({
    auth: ({ req }) => 'foo'
  });

  const enhancers = {
    headers: headersEnhancers
  };
 */
const executeObjectValue = (args, value) => {
  if (typeof value === 'function') {
    return value(...args);
  }

  return value;
};

const executeObjectEnhancer = (args, enhancer) => Object.keys(enhancer).reduce((result, key) => {
  result[key] = executeObjectValue(args, enhancer[key]);
  return result;
}, {});

const composeContextEnhancers = enhancers => (...args) => {
  if (typeof enhancers === 'function') {
    return enhancers(...args);
  }

  if (typeof enhancers === 'object') {
    return executeObjectEnhancer(args, enhancers);
  }

  return {};
};

exports.composeContextEnhancers = composeContextEnhancers;