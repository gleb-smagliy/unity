"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResolver = void 0;

var _core = require("@soyuz/core");

var _parseResolverModel = require("./parse-resolver-model");

const prepareTargetArgs = (key, sourceFieldValues) => sourceFieldValues.map(value => ({
  [key]: value
}));

const createResolver = model => {
  const parseResult = (0, _parseResolverModel.parseResolverModel)(model);

  if (!parseResult.success) {
    return parseResult;
  }

  const {
    query,
    sourceType,
    sourceKey,
    targetKey
  } = parseResult.payload;

  const resolve = async (parent, args, context, info) => {
    const sourceFieldValues = parent[sourceKey];
    const schema = (0, _core.getSchemaFromContext)(context);
    const downstreamContext = (0, _core.addSpecialHeader)(context, 'ref', '1'); // const downstreamContext = {
    //   ...context,
    //   headers: {
    //     ...context.headers,
    //     'x-soyuz-ref': '1'
    //   }
    // };

    if (Array.isArray(sourceFieldValues)) {
      const targetArgs = prepareTargetArgs(targetKey, sourceFieldValues);
      return await schema.batchQueryMany({
        query,
        args: targetArgs,
        context: downstreamContext,
        info
      });
    }

    const targetArgs = {
      [targetKey]: sourceFieldValues
    };
    return await schema.batchQuery({
      query,
      args: targetArgs,
      context: downstreamContext,
      info
    });
  };

  return {
    success: true,
    payload: {
      [sourceType]: {
        [model.aliasField.name]: {
          fragment: `... on ${sourceType} { ${sourceKey} }`,
          resolve
        }
      }
    }
  };
};

exports.createResolver = createResolver;