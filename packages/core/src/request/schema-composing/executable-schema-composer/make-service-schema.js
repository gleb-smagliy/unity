import fetch from 'node-fetch';
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { HttpLink } from 'apollo-link-http';
import { makeRemoteExecutableSchema } from 'graphql-tools'

const createHttpLink = (uri, headers) => new HttpLink({ uri, headers, fetch });

const createContextLink = contextSetter => setContext(contextSetter);

export const makeServiceSchema = ({ schema, endpoint, headers, contextSetter = null }) =>
{
  const links = contextSetter != null ?
    [createContextLink(contextSetter), createHttpLink(endpoint, headers)] :
    [createHttpLink(endpoint, headers)];

  const link = ApolloLink.from(links);

  return makeRemoteExecutableSchema({
    link,
    schema
  });
};