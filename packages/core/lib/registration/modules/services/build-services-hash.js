"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildServicesHash = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ServicesHash {
  constructor({
    servicesHash,
    version
  }) {
    _defineProperty(this, "getServicesList", () => {
      return Object.values(this.servicesHash);
    });

    _defineProperty(this, "getVersion", () => {
      return this.version;
    });

    _defineProperty(this, "setPluginsMetadata", pluginsMetadata => {
      this.pluginsMetadata = pluginsMetadata;
    });

    this.servicesHash = servicesHash;
    this.version = version;
  }

}

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
    payload: new ServicesHash({
      servicesHash,
      version
    })
  };
};

exports.buildServicesHash = buildServicesHash;