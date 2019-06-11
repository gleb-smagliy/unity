"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = void 0;

const identity = value => value;

const toResult = payload => ({
  success: true,
  payload
});

const execute = async (operation, {
  transformPayload = identity,
  transformError = identity,
  transformResult = toResult
} = {}) => {
  try {
    const result = await operation.promise();
    return transformResult(transformPayload(result.Items));
  } catch (err) {
    return {
      success: false,
      error: transformError(err)
    };
  }
};

exports.execute = execute;