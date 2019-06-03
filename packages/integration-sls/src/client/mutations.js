import gql from 'graphql-tag';

const REGISTER = gql`
  mutation($service: ServiceDefinitionInput!) 
  {
    registration: register(service: $service) {
      success2
      error { message } 
      payload { 
       version lock { id time status }
      }
    }
  }
`;

const COMMIT = gql`
    mutation($version: String!) 
    {
      commit: commitSchema(version: $version) 
      {
        success error { message }
      }
    }
`;

module.exports = {
    REGISTER,
    COMMIT
};