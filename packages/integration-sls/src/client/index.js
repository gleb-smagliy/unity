import fetch from 'node-fetch';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";
const { createApolloClient } = require('./create-apollo-client');
const { REGISTER } = require('./mutations');

class SoyuzClient
{
  constructor({ endpoint })
  {
    this.register = this.register.bind(this);

    this.apolloClient = createApolloClient({ endpoint });
  }

  async register({ service })
  {
    const cache = new InMemoryCache();
    const link = new HttpLink({ uri: endpoint, fetch });
    const client = new ApolloClient({ cache, link });

    let response;

    try
    {
      response = await client.query({
        query: this.metadataQuery
      });

      const metadata = response.data.metadata;

      return {
        success: true,
        payload: { metadata }
      }
    }
    catch (e)
    {
      return {
        success: false,
        error: `GraphqlSchemaBuilder::extractMetadata: <${e.message}>`
      }
    }
  }
}

module.exports = {
  SoyuzClient
};