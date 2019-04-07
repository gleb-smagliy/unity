"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypeDefs = void 0;

var _parseTypeDefsModel = require("./parse-type-defs-model");

const createTypeDefs = model => {
  const parseResult = (0, _parseTypeDefsModel.parseTypeDefsModel)(model);

  if (!parseResult.success) {
    return parseResult;
  }

  const {
    sourceType,
    aliasName,
    aliasType
  } = parseResult.payload;
  const payload = `
    extend type ${sourceType}
    {
      ${aliasName}: ${aliasType}
    }
  `;
  return {
    success: true,
    payload
  };
};

exports.createTypeDefs = createTypeDefs;