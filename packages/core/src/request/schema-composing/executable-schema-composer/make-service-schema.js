import fetch from 'node-fetch';
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { HttpLink } from 'apollo-link-http';
import { makeRemoteExecutableSchema } from 'graphql-tools';
import { normalizeHeaders } from './normalize-headers';

const createHttpLink = (uri, headers) => new HttpLink({ uri, headers, fetch });

const createContextLink = (contextSetter, omitHeaders) => setContext((...args) => {
  const context = contextSetter(...args);

  return {
    ...context,
    headers: normalizeHeaders(context.headers, omitHeaders)
  }
});

export const makeServiceSchema = ({ schema, endpoint, headers = {}, contextSetter = null }) =>
{
  const omitHeaders = Object.keys(headers);

  const links = contextSetter != null ?
    [createContextLink(contextSetter, omitHeaders), createHttpLink(endpoint, normalizeHeaders(headers))] :
    [createHttpLink(endpoint, normalizeHeaders(headers))];

  const link = ApolloLink.from(links);

  return makeRemoteExecutableSchema({
    link,
    schema
  });
};