import { graphql } from 'graphql';

export const createRegistrationHandler = ({ success, error, payload }) => ({
  execute: jest.fn().mockReturnValue({ success, error, payload })
});

export const createSchemaBuilders = builders => builders.map(([name, type, definition]) => (
  {
    getApiDefinition: jest.fn().mockReturnValue({
      type,
      name,
      definition
    })
  }));

export const executeRegistration = async (schema, service) => {
  const mutation = `
      mutation register($service: ServiceDefinitionInput!)
      {
        register(service: $service) {
          success
          error {
            message
          }
          warnings {
            message
          }
          payload {
            version
          }
        }
      }
    `;

  return await graphql(schema, mutation, undefined, undefined, { service });
};