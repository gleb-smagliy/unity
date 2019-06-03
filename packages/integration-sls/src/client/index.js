const { createApolloClient } = require('./create-apollo-client');
const { REGISTER } = require('./mutations');

class SoyuzClient {
  constructor({ endpoint }) {
    this.register = this.register.bind(this);

    this.apolloClient = createApolloClient({endpoint});
  }

  async register({ service })
  {
    try
    {
      const response = await this.apolloClient.mutate({
        mutation: REGISTER,
        variables: {
          service
        }
      });

      return response.data ? response.data.registration : { success: false, error: JSON.stringify(response.error, null, 2) }
    }
    catch (e)
    {
      return {
        success: false,
        error: `SoyuzClient::register: ${e.message}`
      }
    }
  }

  async commit({ version })
  {
    try
    {
      const response = await this.apolloClient.mutate({
        mutation: COMMIT,
        variables: {
          version
        }
      });

      return response.data ? response.data.commit : { success: false, error: JSON.stringify(response.error, null, 2) }
    }
    catch (e)
    {
      return {
        success: false,
        error: `SoyuzClient::commit: ${e.message}`
      }
    }
  }
}

module.exports = {
  SoyuzClient
};