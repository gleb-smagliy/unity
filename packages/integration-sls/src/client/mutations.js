import gql from 'graphql-tag';

const REGISTER = gql`
  mutation Register ($service: ServiceDefinitionInput!)
  {
    success
    error { message }
    payload {
      version
      lock { id time status }
    }
  }
`;