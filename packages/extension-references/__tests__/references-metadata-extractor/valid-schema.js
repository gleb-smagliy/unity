export const validMetadata = {
  typeName: 'Availability',
  name: 'ref',
  fieldName: 'membershipLevelIds',
  location: 'OBJECT_TYPE',
  arguments: [
    { name: 'query', value: 'membershipLevelsByIds' },
    { name : 'as', value: 'levels' }
  ],
};

export const validSchema = `
  type MembershipLevel
  {
    id: ID!
  }

  type Availability
  {
    membershipLevelIds: [ID!]
  }

  type Query {
    membershipLevelsByIds(ids: [ID!]): [MembershipLevel]
  }
`;