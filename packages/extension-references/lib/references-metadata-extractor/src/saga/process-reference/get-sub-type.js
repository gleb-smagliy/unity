"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubType = void 0;

var _graphql = require("graphql");

const getSubType = type => {
  const nullableType = (0, _graphql.getNullableType)(type);

  if ((0, _graphql.isListType)(nullableType)) {
    return (0, _graphql.getNullableType)(nullableType.ofType);
  }

  return nullableType;
};

exports.getSubType = getSubType;