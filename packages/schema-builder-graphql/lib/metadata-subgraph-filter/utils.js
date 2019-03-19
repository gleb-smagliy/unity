"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypeDependencies = exports.canContainFields = exports.isRootLevelType = exports.getFieldArgsTypes = void 0;

var _graphql = require("graphql");

const getFieldArgsTypes = field => field.args.map(a => a.type);

exports.getFieldArgsTypes = getFieldArgsTypes;

const isRootLevelType = (type, schema) => type === schema.getQueryType() || type === schema.getMutationType() || type === schema.getSubscriptionType();

exports.isRootLevelType = isRootLevelType;

const canContainFields = type => typeof type.getFields === 'function';

exports.canContainFields = canContainFields;

const getTypeDependencies = (type, schema) => {
  const types = [];
  const fields = type.getFields();

  for (let field of Object.values(fields)) {
    if (!isRootLevelType(field.type, schema)) {
      types.push(field.type);
    }

    if (!(0, _graphql.isInputType)(type)) {
      types.push(...getFieldArgsTypes(field));
    }
  }

  if ((0, _graphql.isObjectType)(type)) {
    types.push(...type.getInterfaces());
  }

  return types;
};

exports.getTypeDependencies = getTypeDependencies;