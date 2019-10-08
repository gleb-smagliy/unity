"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.getLogger = exports.getTracer = void 0;

var _container = require("./container");

const tracingContainer = (0, _container.createContainer)();
const tracing = tracingContainer;
const getTracer = tracingContainer.getTracer;
exports.getTracer = getTracer;
const getLogger = tracingContainer.getLogger;
exports.getLogger = getLogger;
const configure = tracingContainer.configure;
exports.configure = configure;