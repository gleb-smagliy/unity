import { createNamespace } from 'cls-hooked';
import { noop } from './noop';

const LOGGER = Symbol();
const logging = createNamespace(Symbol());

const noopLogger = {
  warn: noop,
  error: noop,
  debug: noop,
  trace: noop,
  info: noop
};

export const createNoopLoggerGetter = () =>
{
  const useLogging = (callback) =>
  {
    return callback();
  };

  return {
    ...noopLogger,
    useLogging
  };
};

export const createLoggerGetter = ({ createLogger }) =>
{
  const getCurrentLogger = () => logging.get(LOGGER);

  const useLogging = (callback, ctx = {}) =>
    logging.runAndReturn(() =>
    {
      const currentLogger = getCurrentLogger();
      const childLogger = currentLogger ?
        currentLogger.child(ctx) :
        createLogger().child(ctx);

      logging.set(LOGGER, childLogger);

      return callback();
    });

  return () =>
  {
    let currentLogger = getCurrentLogger();

    if(!currentLogger)
    {
      currentLogger = createLogger();
    }

    currentLogger.useLogging = useLogging;

    return currentLogger;
  };
};