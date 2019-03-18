"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypesRegistry = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TypesRegistry {
  constructor() {
    _defineProperty(this, "getProperty", (type, getter) => {
      const typeName = type.name;

      if (typeof this.types[typeName] !== 'object' || this.types[typeName] === null) {
        return false;
      }

      return getter(this.types[typeName]);
    });

    _defineProperty(this, "setBanned", type => {
      const typeName = type.name;
      const prevRecord = this.types[typeName] || {};
      this.types[typeName] = { ...prevRecord,
        visited: true,
        banned: true
      };
    });

    _defineProperty(this, "setVisited", type => {
      const typeName = type.name;
      const prevRecord = this.types[typeName] || {};
      this.types[typeName] = { ...prevRecord,
        visited: true
      };
    });

    _defineProperty(this, "isVisited", type => this.getProperty(type, t => !!t.visited));

    _defineProperty(this, "isBanned", type => this.getProperty(type, t => !!t.banned));

    this.types = {};
  }

}

exports.TypesRegistry = TypesRegistry;