import fetch from 'node-fetch';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";

const createApolloClient = ({ endpoint }) => {
  const cache = new InMemoryCache();
  const link = new HttpLink({ uri: endpoint, fetch });

  return new ApolloClient({ cache, link });
};

module.exports = {
  createApolloClient
};