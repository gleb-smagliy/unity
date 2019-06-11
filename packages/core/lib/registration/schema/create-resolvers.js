"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResolvers = void 0;

var _graphqlTypeJson = _interopRequireDefault(require("graphql-type-json"));

var _serviceRegistrationResult = require("./service-registration-result");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const stringifyHeaders = headers => Object.keys(headers).reduce((result, header) => ({ ...headers,
  [header]: JSON.stringify(headers[header])
}), {});

const createResolvers = ({
  registrationHandler,
  versionTaggingHandler,
  registrationCommitingHandler
}) => ({
  JSON: _graphqlTypeJson.default,
  Mutation: {
    async register(_, {
      service
    }) {
      const {
        id,
        endpoint,
        args = {},
        headers = {},
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
        args,
        headers: stringifyHeaders(headers),
        endpoint,
        schemaBuilder: builder,
        options
      };
      const result = await registrationHandler.execute(command);
      return result.success ? (0, _serviceRegistrationResult.success)(result.payload, result.warnings) : (0, _serviceRegistrationResult.error)(result.error, result.warnings);
    },

    async tagVersion(_, {
      version,
      tag,
      args = {}
    }) {
      const command = {
        version,
        tag,
        args
      };
      const result = await versionTaggingHandler.execute(command);
      return result.success ? (0, _serviceRegistrationResult.success)(result.payload, result.warnings) : (0, _serviceRegistrationResult.error)(result.error, result.warnings);
    },

    async commitSchema(_, {
      version,
      stage,
      args = {}
    }) {
      const command = {
        version,
        stage,
        args
      };
      const result = await registrationCommitingHandler.execute(command);
      return result.success ? (0, _serviceRegistrationResult.success)(result.payload, result.warnings) : (0, _serviceRegistrationResult.error)(result.error, result.warnings);
    }

  }
});

exports.createResolvers = createResolvers;