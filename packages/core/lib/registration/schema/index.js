"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = void 0;

var _createSchema = require("./create-schema");

var _registrationHandler = require("../command-handlers/registration-handler");

const createSchema = options => (0, _createSchema.createSchema)({
  schemaBuilders: options.schemaBuilders,
  registrationHandler: new _registrationHandler.ServiceRegistrationCommandHander(options)
});

exports.createSchema = createSchema;