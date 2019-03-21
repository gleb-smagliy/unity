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
  
  type TextError
  {
    message: String
  }
  
  enum RegistrationLockStatus
  {
      ACQUIRED,
      ALREADY_LOCKED,
      FAILURE
  }
  
  type RegistrationLock
  {
    id: ID!,
    time: Int!
    status: RegistrationLockStatus
  }
  
  type ServiceRegistrationPayload
  {
    version: String
    lock: RegistrationLock
  }

  type ServiceRegistrationResult
  {
    success: Boolean
    warnings: [ServiceRegistrationWarning]!
    error: TextError
    payload: ServiceRegistrationPayload
  }

  type RegistrationCommitResultPayload
  {
    lock: RegistrationLock
  }

  type RegistrationCommitResult
  {
    success: Boolean
    error: TextError
  }
  
  type VersionTaggingResult
  {
    success: Boolean
    error: TextError
  }

  type Mutation
  {
    register(service: ServiceDefinitionInput!): ServiceRegistrationResult!
    commitSchema(version: String!, args: JSON): RegistrationCommitResult!
    tagVersion(version: String!, tag: String!, args: JSON): VersionTaggingResult!
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
    scalar JSON
  
    input SchemaBuilderUnionInput
    {
      ${fields}
    }
  
    input ServiceDefinitionInput
    {
      id: String!
      endpoint: String!
      args: JSON
      schemaBuilder: SchemaBuilderUnionInput!
    }
  `;
};

const composeBuildersDefinitions = apiDefinitions => apiDefinitions.map(d => d.definition);