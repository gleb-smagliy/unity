import { noop } from './noop';

const noopTracer = {
  wrap: (operationName, func) => func,
  addAnnotation: noop,
  addMetadata: noop,
};

export const createNoopTracerGetter = () => {
  return () => noopTracer;
};

export const createTracerGetter = ({ tracer }) => {
  return () => tracer;
};