"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServicesHash = void 0;

var _graphqlTools = require("graphql-tools");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const convertMetadataItem = metadataItem => ({ ...metadataItem,
  arguments: metadataItem.arguments.map(arg => ({ ...arg,
    value: JSON.parse(arg.value)
  }))
});

const getMetadata = services => {
  const serviceKeys = Object.keys(services);
  const result = {};

  for (let key of serviceKeys) {
    const service = services[key];
    const {
      metadata = []
    } = service;

    for (let metadataItem of metadata) {
      const name = metadataItem.name;

      if (!result[name]) {
        result[name] = [];
      }

      result[name].push(convertMetadataItem(metadataItem));
    }
  }

  return result;
};

const getSchemas = servicesHash => Object.keys(servicesHash).map(k => servicesHash[k].schema);

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

    _defineProperty(this, "getTransformedClientSchema", () => (0, _graphqlTools.mergeSchemas)({
      schemas: getSchemas(this.servicesHash)
    }));

    _defineProperty(this, "getMetadata", ({
      name
    }) => this.servicesMetadata[name] || []);

    this.servicesHash = servicesHash;
    this.version = version;
    this.servicesMetadata = getMetadata(servicesHash);
  }

}

exports.ServicesHash = ServicesHash;