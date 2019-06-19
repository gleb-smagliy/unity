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

var _normalizeHeaders = require("./normalize-headers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createHttpLink = (uri, headers) => new _apolloLinkHttp.HttpLink({
  uri,
  headers,
  fetch: _nodeFetch.default
});

const createContextLink = (contextSetter, omitHeaders) => (0, _apolloLinkContext.setContext)((...args) => {
  const context = contextSetter(...args);
  return { ...context,
    headers: (0, _normalizeHeaders.normalizeHeaders)(context.headers, omitHeaders)
  };
});

const makeServiceSchema = ({
  schema,
  endpoint,
  headers = {},
  contextSetter = null
}) => {
  const omitHeaders = Object.keys(headers);
  const links = contextSetter != null ? [createContextLink(contextSetter, omitHeaders), createHttpLink(endpoint, (0, _normalizeHeaders.normalizeHeaders)(headers))] : [createHttpLink(endpoint, (0, _normalizeHeaders.normalizeHeaders)(headers))];

  const link = _apolloLink.ApolloLink.from(links);

  return (0, _graphqlTools.makeRemoteExecutableSchema)({
    link,
    schema
  });
};

exports.makeServiceSchema = makeServiceSchema;