"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResolvers = void 0;

var _serviceRegistrationResult = require("./service-registration-result");

const createResolvers = ({
  registrationHandler
}) => ({
  Mutation: {
    async register(_, {
      service
    }) {
      const {
        id,
        schemaBuilder
      } = service;
      const usedSchemaBuilders = Object.keys(schemaBuilder).filter(k => schemaBuilder[k] != null);

      if (usedSchemaBuilders.length !== 1) {
        return (0, _serviceRegistrationResult.error)("You should specify exactly one schema builder.");
      }

      const builder = usedSchemaBuilders[0];
      const options = schemaBuilder[builder];
      const command = {
        id,
        schemaBuilder: builder,
        options
      };
      const result = await registrationHandler.execute(command);
      return result.success ? (0, _serviceRegistrationResult.success)(result.payload, result.warnings) : (0, _serviceRegistrationResult.error)(result.error, result.warnings);
    }

  }
});

exports.createResolvers = createResolvers;