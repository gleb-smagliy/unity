"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLoggerGetter = exports.createNoopLoggerGetter = void 0;

var _clsHooked = require("cls-hooked");

var _noop = require("./noop");

const LOGGER = Symbol();
const logging = (0, _clsHooked.createNamespace)(Symbol());
const noopLogger = {
  warn: _noop.noop,
  error: _noop.noop,
  debug: _noop.noop,
  trace: _noop.noop,
  info: _noop.noop
};

const createNoopLoggerGetter = () => {
  const useLogging = callback => {
    return callback();
  };

  return { ...noopLogger,
    useLogging
  };
};

exports.createNoopLoggerGetter = createNoopLoggerGetter;

const createLoggerGetter = ({
  createLogger
}) => {
  const getCurrentLogger = () => logging.get(LOGGER);

  const useLogging = (callback, ctx = {}) => logging.runAndReturn(() => {
    const currentLogger = getCurrentLogger();
    const childLogger = currentLogger ? currentLogger.child(ctx) : createLogger().child(ctx);
    logging.set(LOGGER, childLogger);
    return callback();
  });

  return () => {
    let currentLogger = getCurrentLogger();

    if (!currentLogger) {
      currentLogger = createLogger();
    }

    currentLogger.useLogging = useLogging;
    return currentLogger;
  };
};

exports.createLoggerGetter = createLoggerGetter;