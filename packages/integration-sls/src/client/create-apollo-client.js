const createApolloClient = ({ endpoint }) => {
  const cache = new InMemoryCache();
  const link = new HttpLink({ uri: endpoint, fetch });

  return new ApolloClient({ cache, link });
};

module.exports = {
  createApolloClient
};