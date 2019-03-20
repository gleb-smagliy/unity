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
    commitSchema(version: String!): RegistrationCommitResult!
    tagVersion(version: String!, tag: String!): VersionTaggingResult!
  }
  
  type Query
  {
    version: String
  }
`;

export const createTypeDefinitions = (apiDefinitions) => [
  REGISTER_MUTATION,
  composeBuildersUnion(apiDefinitions),
  ...composeBuildersDefinitions(apiDefinitions)
];

const composeBuildersUnion = (apiDefinitions) =>
{
  const fields = apiDefinitions
    .map(d => `${d.name}: ${d.type}`)
    .join(' \n');

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