import { buildFakeClientSchema } from "../../../fake-schema";
import { GRAPHQL_COMMAND } from './graphql-command';

export const USER_SCHEMA = buildFakeClientSchema(`
  type User {
    id: ID!
    firstName: String!
    lastName: String
  }

  type Query {
    me: User!
  }
`);

export const SOME_SERVICE_METADATA = [{
  name: 'some_metadata_name',
  'SOME_SERVICE_METADATA_KEY': 'SOME_SERVICE_METADATA_VALUE'
}];

export const DEFAULT_BUILDER = {
  name: 'graphql',
  service: { id: GRAPHQL_COMMAND.id, schema: USER_SCHEMA}
};

export const createFailedBuilder = ({ name = DEFAULT_BUILDER.name, metadata = SOME_SERVICE_METADATA } = {}) => ({
  name,
  buildServiceModel: jest.fn().mockResolvedValue({ success: false, error: 'unknown error' }),
  extractMetadata: jest.fn().mockResolvedValue({
    success: true,
    payload: { metadata }
  })
});

export const createSuccessfulBuilder = ({ name, service, metadata = SOME_SERVICE_METADATA } = DEFAULT_BUILDER) => ({
  name,
  buildServiceModel: jest.fn().mockResolvedValue({ success: true, payload: service }),
  extractMetadata: jest.fn().mockResolvedValue({
    success: true,
    payload: { metadata }
  })
});