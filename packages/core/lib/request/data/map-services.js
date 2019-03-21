"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapServices = void 0;

var _services = require("../../common-modules/services");

const mapServices = (services, args) => {
  const result = [];

  for (let service of services) {
    const uriArgs = { ...service.args,
      ...args
    };
    const endpointResult = (0, _services.buildUri)(service.endpoint, uriArgs);

    if (!endpointResult.success) {
      return endpointResult;
    }

    result.push({ ...service,
      endpoint: endpointResult.payload
    });
  }

  return {
    success: true,
    payload: result
  };
};

exports.mapServices = mapServices;