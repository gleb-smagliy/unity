"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeServiceSchema = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _apolloLink = require("apollo-link");

var _apolloLinkContext = require("apollo-link-context");

var _apolloLinkHttp = require("apollo-link-http");

var _graphqlTools = require("graphql-tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createHttpLink = uri => new _apolloLinkHttp.HttpLink({
  uri,
  fetch: _nodeFetch.default
});

const createContextLink = contextSetter => (0, _apolloLinkContext.setContext)(contextSetter);

const makeServiceSchema = ({
  schema,
  uri,
  contextSetter = null
}) => {
  const links = contextSetter != null ? [createContextLink(contextSetter), createHttpLink(uri)] : [createHttpLink(uri)];

  const link = _apolloLink.ApolloLink.from(links);

  return (0, _graphqlTools.makeRemoteExecutableSchema)({
    link,
    schema
  });
};

exports.makeServiceSchema = makeServiceSchema;