"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IncrementalVersioning = exports.ZERO_VERSION = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ZERO_VERSION = "0";
exports.ZERO_VERSION = ZERO_VERSION;

class IncrementalVersioning {
  constructor() {
    _defineProperty(this, "createVersion", ({
      currentVersion
    }) => {
      if (currentVersion == null) {
        return {
          success: true,
          payload: {
            version: ZERO_VERSION
          }
        };
      }

      const prevVersion = parseInt(currentVersion);

      if (isNaN(prevVersion)) {
        return {
          success: false,
          error: `Expected version to be a number, but <${currentVersion}> given`
        };
      }

      return {
        success: true,
        payload: {
          version: (prevVersion + 1).toString()
        }
      };
    });
  }

}

exports.IncrementalVersioning = IncrementalVersioning;