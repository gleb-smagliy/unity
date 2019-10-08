import { createNoopLoggerGetter, createLoggerGetter } from './logging';
import { createNoopTracerGetter, createTracerGetter } from './tracing';

export const createContainer = () =>
{
  let getLogger = createNoopLoggerGetter();
  let getTracer = createNoopTracerGetter();

  return {
    configure: (configuration = {}) =>
    {
      const {
        tracer,
        createLogger
      } = configuration;

      if(tracer)
      {
        getTracer = createTracerGetter({ tracer });
      }

      if(createLogger)
      {
        getLogger = createLoggerGetter({ createLogger });

        getLogger().info('logging configured to {level}', { level: getLogger().level });
      }
    },
    getLogger: () => getLogger(),
    getTracer: () => getTracer()
  };
};