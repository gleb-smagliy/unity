"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.effects = exports.EFFECTS = void 0;
const EFFECTS = {
  CALL: 'EFFECTS/CALL'
};
exports.EFFECTS = EFFECTS;

const call = (func, ...args) => ({
  operation: EFFECTS.CALL,
  func,
  args
});

const effects = {
  call
};
exports.effects = effects;