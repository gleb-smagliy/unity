"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceRegistrationCommandHander = void 0;

var _locking = require("../../modules/locking");

var _plugins = require("../../modules/plugins");

var _sagaRunner = require("../../../common-modules/saga-runner");

var _registrationSaga = require("./registration-saga");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ServiceRegistrationCommandHander {
  constructor(options) {
    _defineProperty(this, "execute", async command => {
      const {
        id: serviceId
      } = command;
      const saga = (0, _registrationSaga.registrationSaga)({
        command,
        options: this.options,
        extractPluginsMetadata: this.extractPluginsMetadata
      });
      return this.withLock(serviceId, async () => await (0, _sagaRunner.runSaga)(saga));
    });

    _defineProperty(this, "extractPluginsMetadata", async servicesHash => await (0, _plugins.extractMetadataForPlugins)({
      plugins: [...this.options.extensionBuilders, ...this.options.gatewaySchemaTransformers],
      args: [servicesHash]
    }));

    this.options = options;
    this.withLock = (0, _locking.lockBarrier)(options.locking);
  }

}

exports.ServiceRegistrationCommandHander = ServiceRegistrationCommandHander;