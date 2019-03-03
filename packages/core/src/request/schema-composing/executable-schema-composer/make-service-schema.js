import fetch from 'node-fetch';
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { HttpLink } from 'apollo-link-http';
import { makeRemoteExecutableSchema } from 'graphql-tools'

const createHttpLink = uri => new HttpLink({ uri, fetch });

const createContextLink = contextSetter => setContext(contextSetter);

export const makeServiceSchema = ({ schema, uri, contextSetter = null }) =>
{
  const links = contextSetter != null ?
    [createContextLink(contextSetter), createHttpLink(uri)] :
    [createHttpLink(uri)];

  const link = ApolloLink.from(links);

  return makeRemoteExecutableSchema({
    link,
    schema
  });
};