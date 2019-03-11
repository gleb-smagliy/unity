"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTypeDefinitions = void 0;
const REGISTER_MUTATION = `
  type ServiceRegistrationWarning
  {
    message: String
  }
  
  type ServiceRegistrationError
  {
    message: String
  }
  
  type ServiceRegistrationPayload
  {
    version: String
  }

  type ServiceRegistrationResult
  {
    success: Boolean
    warnings: [ServiceRegistrationWarning]!
    error: ServiceRegistrationError
    payload: ServiceRegistrationPayload
  }

  type Mutation
  {
    register(service: ServiceDefinitionInput!): ServiceRegistrationResult!
  }
  
  type Query
  {
    version: String
  }
`;

const createTypeDefinitions = apiDefinitions => [REGISTER_MUTATION, composeBuildersUnion(apiDefinitions), ...composeBuildersDefinitions(apiDefinitions)];

exports.createTypeDefinitions = createTypeDefinitions;

const composeBuildersUnion = apiDefinitions => {
  const fields = apiDefinitions.map(d => `${d.name}: ${d.type}`).join(' \n');
  return `
    input SchemaBuilderUnionInput
    {
      ${fields}
    }
  
    input ServiceDefinitionInput
    {
      id: String
      schemaBuilder: SchemaBuilderUnionInput!
    }
  `;
};

const composeBuildersDefinitions = apiDefinitions => apiDefinitions.map(d => d.definition);