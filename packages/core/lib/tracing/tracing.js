"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTracerGetter = exports.createNoopTracerGetter = void 0;

var _noop = require("./noop");

const noopTracer = {
  wrap: (operationName, func) => func,
  addAnnotation: _noop.noop,
  addMetadata: _noop.noop
};

const createNoopTracerGetter = () => {
  return () => noopTracer;
};

exports.createNoopTracerGetter = createNoopTracerGetter;

const createTracerGetter = ({
  tracer
}) => {
  return () => tracer;
};

exports.createTracerGetter = createTracerGetter;