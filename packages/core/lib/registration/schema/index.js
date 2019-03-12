"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = void 0;

var _options = require("../../common-modules/options");

var _createSchema = require("./create-schema");

var _registrationHandler = require("../command-handlers/registration-handler");

const createSchema = rawOptions => {
  const optionsPreparation = (0, _options.prepareOptions)(rawOptions);

  if (!optionsPreparation.success) {
    throw new Error(optionsPreparation.error);
  }

  const options = optionsPreparation.payload;
  return (0, _createSchema.createSchema)({
    schemaBuilders: options.schemaBuilders,
    registrationHandler: new _registrationHandler.ServiceRegistrationCommandHander(options)
  });
};

exports.createSchema = createSchema;