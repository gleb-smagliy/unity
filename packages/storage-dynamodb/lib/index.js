"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStorage = void 0;

var _awsSdk = require("aws-sdk");

var _queries = require("./queries");

var _commands = require("./commands");

const createStorage = ({
  clientOptions,
  tables: {
    schema,
    tags
  }
}) => {
  const docClient = new _awsSdk.DynamoDB.DocumentClient(clientOptions);
  return {
    queries: {
      getSchemaByVersion: (0, _queries.createGetSchemaByVersionQuery)({
        docClient,
        tableName: schema
      }),
      getServicesByVersion: (0, _queries.createGetServicesByVersionQuery)({
        docClient,
        tableName: schema
      }),
      getVersionByTag: (0, _queries.createGetVersionByTagQuery)({
        docClient,
        tableName: tags
      })
    },
    commands: {
      insertSchema: (0, _commands.createInsertSchemaCommand)({
        docClient,
        tableName: schema
      }),
      upsertTag: (0, _commands.createUpsertTagCommand)({
        docClient,
        tableName: tags
      })
    }
  };
};

exports.createStorage = createStorage;