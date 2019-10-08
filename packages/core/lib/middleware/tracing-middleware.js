"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTracingToSchema = void 0;

var _graphqlMiddleware = require("graphql-middleware");

var _tracing = require("../tracing");

const fieldPathFromInfo = info => {
  let path = info.path;
  const segments = [];

  while (path) {
    segments.unshift(path.key);
    path = path.prev;
  }

  return segments.join('.');
};

const tracerMiddleware = (resolver, parent, args, ctx, info) => {
  const fieldPath = fieldPathFromInfo(info); // l().info('tracerMiddleware::info.path: ',
  // {
  //   fieldPath,
  //   jsonPath: JSON.stringify(info.path)
  // });

  return (0, _tracing.getTracer)().wrap(`GraphQL ${fieldPath}`, resolver)();
};

const applyTracingToSchema = schema => {
  (0, _graphqlMiddleware.applyMiddlewareToDeclaredResolvers)(schema, tracerMiddleware);
};

exports.applyTracingToSchema = applyTracingToSchema;