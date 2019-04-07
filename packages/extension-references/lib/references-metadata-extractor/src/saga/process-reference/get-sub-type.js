"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubType = void 0;

var _graphql = require("graphql");

const getSubType = type => {
  const nullableType = (0, _graphql.getNullableType)();

  if ((0, _graphql.isListType)(nullableType)) {
    return type.ofType;
  }

  return type;
};

exports.getSubType = getSubType;