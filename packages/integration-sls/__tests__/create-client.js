const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');

const createClient = ({ endpoint }) => {
  const cache = new InMemoryCache();
  const link = new HttpLink({ uri: endpoint, fetch });

  return new ApolloClient({ cache, link });
};

module.exports = {
  createClient
};