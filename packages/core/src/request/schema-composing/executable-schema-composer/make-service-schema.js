import fetch from 'node-fetch';
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { HttpLink } from 'apollo-link-http';
import { makeRemoteExecutableSchema } from 'graphql-tools';
import { normalizeHeaders } from './normalize-headers';
import { getSpecialHeaders } from '../../context';

const emptyContext = request => request;
const createHttpLink = (uri, headers) => new HttpLink({ uri, headers, fetch });

const createContextLink = (contextSetter = emptyContext, omitHeaders) => setContext((request, previousContext) => {
  const context = contextSetter(request, previousContext);

  // console.log('createContextLink::request', context);
  // console.log('createContextLink::previousContext', previousContext);
  // console.log('createContextLink::context', context);

  const ret = {
    ...context,
    headers: {
      ...normalizeHeaders(context.headers, omitHeaders),
      ...getSpecialHeaders(context)
    }
  };

  // console.log('createContextLink::ret', context);

  return ret;
});

export const makeServiceSchema = ({ schema, endpoint, headers = {}, contextSetter = null }) =>
{
  const omitHeaders = Object.keys(headers);

  // const links = contextSetter != null ?
  //   [createContextLink(contextSetter, omitHeaders), createHttpLink(endpoint, normalizeHeaders(headers))] :
  //   [createHttpLink(endpoint, normalizeHeaders(headers))];
  const links = [
    createContextLink(contextSetter, omitHeaders),
    createHttpLink(endpoint, normalizeHeaders(headers))
  ];

  const link = ApolloLink.from(links);

  return makeRemoteExecutableSchema({
    link,
    schema
  });
};