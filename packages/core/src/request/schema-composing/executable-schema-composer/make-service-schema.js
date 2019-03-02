import fetch from 'node-fetch';
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { HttpLink } from 'apollo-link-http';
import { transformSchema } from 'graphql-tools';

export const makeServiceSchema = ({ schema, contextSetter = null }) =>
{
  if(contextSetter == null)
  {

  }
};