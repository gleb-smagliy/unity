"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tracing = void 0;

var _tracing = require("./tracing");

const tracing = (0, _tracing.createTracing)(); // export const tracing = null;

exports.tracing = tracing;