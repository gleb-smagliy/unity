import { applyMiddlewareToDeclaredResolvers } from 'graphql-middleware';
import { getLogger as l, getTracer as t } from '../tracing';

const fieldPathFromInfo = (info) => {
  let path = info.path;
  const segments = [];
  while (path) {
    segments.unshift(path.key);
    path = path.prev;
  }

  return segments.join('.');
};

const tracerMiddleware = (resolver, parent, args, ctx, info) => {
  const fieldPath = fieldPathFromInfo(info);

  // l().info('tracerMiddleware::info.path: ',
  // {
  //   fieldPath,
  //   jsonPath: JSON.stringify(info.path)
  // });

  return t().wrap(`GraphQL ${fieldPath}`,  resolver)();
};

export const applyTracingToSchema = (schema) => {
  applyMiddlewareToDeclaredResolvers(schema, tracerMiddleware);
};