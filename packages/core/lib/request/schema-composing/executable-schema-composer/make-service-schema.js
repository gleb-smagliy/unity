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

var _context = require("../../context");

var _tracing = require("../../../tracing");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyContext = request => request;

const createHttpLink = (uri, headers) => new _apolloLinkHttp.HttpLink({
  uri,
  headers,
  fetch: _nodeFetch.default
});

const createContextLink = (contextSetter = emptyContext, omitHeaders, endpoint) => (0, _apolloLinkContext.setContext)((request, previousContext) => {
  const context = contextSetter(request, previousContext); // console.log('createContextLink::request', context);
  // console.log('createContextLink::previousContext', previousContext);
  // console.log('createContextLink::context', context);

  const ret = { ...context,
    headers: { ...(0, _normalizeHeaders.normalizeHeaders)(context.headers, omitHeaders),
      ...(0, _context.getSpecialHeaders)(context)
    }
  }; // console.log('createContextLink::ret', context);

  (0, _tracing.getLogger)().info('delegating query to {endpoint}', {
    endpoint
  });
  return ret;
});

const makeServiceSchema = ({
  schema,
  endpoint,
  headers = {},
  contextSetter = null
}) => {
  const omitHeaders = Object.keys(headers); // const links = contextSetter != null ?
  //   [createContextLink(contextSetter, omitHeaders), createHttpLink(endpoint, normalizeHeaders(headers))] :
  //   [createHttpLink(endpoint, normalizeHeaders(headers))];

  const links = [createContextLink(contextSetter, omitHeaders, endpoint), createHttpLink(endpoint, (0, _normalizeHeaders.normalizeHeaders)(headers))];

  const link = _apolloLink.ApolloLink.from(links);

  return (0, _graphqlTools.makeRemoteExecutableSchema)({
    link,
    schema
  });
};

exports.makeServiceSchema = makeServiceSchema;