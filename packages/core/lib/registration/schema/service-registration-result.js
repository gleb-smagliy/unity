"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.success = void 0;

const success = (payload, warnings = []) => ({
  success: true,
  warnings: warnings.map(stringToWarning),
  payload
});

exports.success = success;

const error = (error, warnings = []) => ({
  success: false,
  error: stringToError(error),
  warnings: warnings.map(stringToWarning)
});

exports.error = error;

const stringToWarning = message => ({
  message
});

const stringToError = message => ({
  message
});