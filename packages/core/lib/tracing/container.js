"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContainer = void 0;

var _logging = require("./logging");

var _tracing = require("./tracing");

const createContainer = () => {
  let getLogger = (0, _logging.createNoopLoggerGetter)();
  let getTracer = (0, _tracing.createNoopTracerGetter)();
  return {
    configure: (configuration = {}) => {
      const {
        tracer,
        createLogger
      } = configuration;

      if (tracer) {
        getTracer = (0, _tracing.createTracerGetter)({
          tracer
        });
      }

      if (createLogger) {
        getLogger = (0, _logging.createLoggerGetter)({
          createLogger
        });
        getLogger().info('logging configured to {level}', {
          level: getLogger().level
        });
      }
    },
    getLogger: () => getLogger(),
    getTracer: () => getTracer()
  };
};

exports.createContainer = createContainer;