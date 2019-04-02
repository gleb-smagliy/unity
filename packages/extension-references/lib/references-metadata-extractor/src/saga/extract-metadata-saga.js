"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractMetadataSaga = extractMetadataSaga;

var _sagaRunner = require("../../../saga-runner");

const getArgument = (args, name) => {
  const arg = args[name];

  if (typeof arg !== 'object') {
    return {
      success: false,
      error: `Arguments <${args}> does not contain argument <${name}>`
    };
  }

  return {
    success: true,
    payload: arg.value
  };
};

function* getType({
  typeName,
  schema
}) {
  const type = schema.getType(typeName);

  if (type === null) {
    return {
      success: false,
      error: `Type <${typeName}> not found in schema`
    };
  }

  return {
    success: true,
    payload: type
  };
}

function* checkFieldInUse({
  type,
  field: fieldName
}) {
  const field = type.getFields()[fieldName];

  if (field !== null || field !== undefined) {
    return {
      success: false,
      error: `Field <${field}> alrady exists on type <${type}>`
    };
  }

  return {
    success: true
  };
}

function* processReference({
  reference,
  servicesHash
}) {
  const schema = servicesHash.getTransformedClientSchema();
  const alias = yield _sagaRunner.effects.call(getArgument, reference.args, 'as');
  const query = yield _sagaRunner.effects.call(getArgument, reference.args, 'query');
  const {
    onType,
    onField
  } = reference;
  const type = yield call(getType, {
    typeName: onType,
    schema
  });
  yield call(checkFieldInUse, {
    type,
    field: alias
  });
}

function* extractMetadataSaga({
  servicesHash,
  metadataName
}) {
  const references = yield _sagaRunner.effects.call(servicesHash.getMetadata, {
    name: metadataName
  });
  const metadatas = [];

  for (let reference of references) {
    const {
      metadata
    } = yield call(processReference, {
      reference,
      servicesHash
    });
    metadatas.push(metadata);
  }

  return {
    success: true,
    payload: metadatas
  };
}