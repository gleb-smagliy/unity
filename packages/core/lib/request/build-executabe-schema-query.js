"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildExecutableSchemaQuery = void 0;

var _getSchemaVersion = require("./data/get-schema-version");

var _schemaComposing = require("./schema-composing");

//todo: currently just a stub
const prepareOptions = options => {
  if (typeof options !== 'object' || options === null) {
    return {
      success: false,
      error: 'Expected options to be a non-null object'
    };
  }

  return {
    success: true,
    payload: options
  };
};

const buildExecutableSchemaQuery = options => {
  const optionsPreparation = prepareOptions(options);

  if (!optionsPreparation.success) {
    throw new Error(`Options is not valid: <${optionsPreparation.error}>`);
  }

  const composeSchema = (0, _schemaComposing.buildSchemaComposer)(optionsPreparation.payload);
  return async ({
    version,
    tag
  }) => {
    const {
      getVersionByTag
    } = options.storage.queries;
    const schemaVersionResult = await (0, _getSchemaVersion.getSchemaVersion)({
      version,
      tag,
      getVersionByTag
    });

    if (!schemaVersionResult.success) {
      throw new Error(schemaVersionResult.error);
    }

    const schemaVersion = schemaVersionResult.payload;
    const result = await composeSchema({
      version: schemaVersion
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.payload;
  };
};
/*
  usage (lambda):

  const getExecutableSchema = buildExecutableSchemaRetriever(options);

  const { version, tag } = getSchemaSpecificationFromEvent(event);

  const schema = await getExecutableSchema({ version, tag })

  return new ApolloServer({ schema }).createHandler();
 */


exports.buildExecutableSchemaQuery = buildExecutableSchemaQuery;