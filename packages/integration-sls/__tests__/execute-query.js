const fetch = require('node-fetch');
const { print } = require('graphql');

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

const executeQuery = async ({
  endpoint,
  query,
  variables,
  headers
}) => {

  const body = JSON.stringify({
    query: print(query),
    variables
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers
    }
  });

  return await response.json();
};

module.exports = {
  executeQuery
};