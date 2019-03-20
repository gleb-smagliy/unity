"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = void 0;

var _options = require("../../common-modules/options");

var _createSchema = require("./create-schema");

var _registrationHandler = require("../command-handlers/registration-handler");

var _schemaVersionTagingHandler = require("../command-handlers/schema-version-taging-handler");

var _registrationCommitingHandler = require("../command-handlers/registration-commiting-handler");

const createSchema = rawOptions => {
  const optionsPreparation = (0, _options.prepareOptions)(rawOptions);

  if (!optionsPreparation.success) {
    throw new Error(optionsPreparation.error);
  }

  const options = optionsPreparation.payload;
  const {
    schemaBuilders
  } = options;
  const schemaVersionTaggingHandler = new _schemaVersionTagingHandler.SchemaVersionTaggingHandler(options);
  const registrationHandler = new _registrationHandler.ServiceRegistrationCommandHander(options);
  const registrationCommitingHandler = new _registrationCommitingHandler.RegistrationCommitingHandler({
    schemaVersionTaggingHandler
  }, options);
  return (0, _createSchema.createSchema)({
    schemaBuilders,
    registrationHandler,
    schemaVersionTaggingHandler,
    registrationCommitingHandler
  });
};

exports.createSchema = createSchema;