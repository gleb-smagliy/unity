function noop () { }

const DEFAULT_OPTIONS = {
  logLevel: 'NONE',
  trace: false,
  tracer: {
    wrap: noop,
    addAnnotation: noop,
    addMetadata: noop,
    warn: noop,
    error: noop,
    debug: noop,
    trace: noop,
    info: noop
  }
};

export const createTracing = () =>
{
  let options = DEFAULT_OPTIONS;

  return {
    configure: (configuration = {}) =>
    {
      const tracer = {
        ...DEFAULT_OPTIONS.tracer,
        ...(configuration.tracer || {})
      };

      options = {
        ...DEFAULT_OPTIONS,
        ...configuration,
        tracer
      };

      console.log('configured tracing to ', options);
      console.log('configured tracing.tracer.info to ', options.tracer.info);
    },
    wrap: (operationName, func) =>
    {
      if(!options.trace)
      {
        return func;
      }

      return options.tracer.wrap(operationName, func);
    },
    addAnnotation: options.tracer.addAnnotation,
    addMetadata: options.tracer.addMetadata,
    warn: (...args) =>
    {
      options.tracer.warn(...args)
    },
    error: (...args) =>
    {
      options.tracer.error(...args)
    },
    debug: (...args) =>
    {
      options.tracer.debug(...args)
    },
    trace: (...args) =>
    {
      options.tracer.trace(...args)
    },
    info: (...args) =>
    {
      options.tracer.info(...args)
    }
  };
};