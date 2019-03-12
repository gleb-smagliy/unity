import {buildFakeClientSchema} from "./build-fake-client-schema";

/*
  Version: String // HashKey
  ServiceId: String // SortKey
  Schema: String // Json serialized
  Metadata: String // Json serialized
 */

export const SERVICES_TABLE = [
  {
    Key: '1_Services', // HashKey
    Id: 'User', // SortKey
    Version: '1',
    ServiceSchema: buildFakeClientSchema(`
      type User {
        id: ID!
        firstName: String
        lastName: String
      }
    
      type Query {
        me: User
      }
    `),
    ServiceMetadata: [
      {
        name: 'ref',
        onType: 'User',
        onField: 'id',
        args: [
          { name: 'query', type: 'String!', value: 'organizationByUserId'},
          { name: 'as', type: 'String!', value: 'organization' }
        ]
      }
    ]
  }
];