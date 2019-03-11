"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidTransform = void 0;

const isValidTransform = t => typeof t === 'object' && t !== null;

exports.isValidTransform = isValidTransform;