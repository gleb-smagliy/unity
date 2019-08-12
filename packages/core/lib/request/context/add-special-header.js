"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecialHeaders = exports.addSpecialHeader = exports.SPECIAL_HEADERS_PREFIX = exports.SPECIAL_HEADERS_SYMBOL = void 0;
const SPECIAL_HEADERS_SYMBOL = Symbol('SPECIAL_HEADERS');
exports.SPECIAL_HEADERS_SYMBOL = SPECIAL_HEADERS_SYMBOL;
const SPECIAL_HEADERS_PREFIX = 'x-soyuz';
exports.SPECIAL_HEADERS_PREFIX = SPECIAL_HEADERS_PREFIX;

const addSpecialHeader = (context, name, value) => {
  const prevHeaders = context[SPECIAL_HEADERS_SYMBOL] || {};
  return { ...context,
    [SPECIAL_HEADERS_SYMBOL]: { ...prevHeaders,
      [`${SPECIAL_HEADERS_PREFIX}-${name}`]: value
    }
  };
};

exports.addSpecialHeader = addSpecialHeader;

const getSpecialHeaders = context => {
  return context[SPECIAL_HEADERS_SYMBOL] || {};
};

exports.getSpecialHeaders = getSpecialHeaders;