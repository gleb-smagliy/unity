import { createContainer } from './container';

const tracingContainer = createContainer();

const tracing = tracingContainer;

export const getTracer = tracingContainer.getTracer;
export const getLogger = tracingContainer.getLogger;
export const configure = tracingContainer.configure;


