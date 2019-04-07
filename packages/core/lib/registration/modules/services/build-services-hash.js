"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildServicesHash = void 0;

var _servicesHash = require("./services-hash");

const servicesReducer = (hash, service) => ({ ...hash,
  [service.id]: service
});

const buildServicesHash = ({
  services,
  version,
  upsert,
  transform
}) => {
  const fullServicesList = [...services, upsert];
  const hashingServices = transform(fullServicesList.reduce(servicesReducer, {}));

  if (!hashingServices.success) {
    return hashingServices;
  }

  const servicesHash = hashingServices.payload;
  return {
    success: true,
    payload: new _servicesHash.ServicesHash({
      servicesHash,
      version
    })
  };
};

exports.buildServicesHash = buildServicesHash;