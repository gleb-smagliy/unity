import { DEFAULT_OPTIONS } from '../../src/graphql-schema-builder/graphql-schema-builder';

const CUSTOM_METADATA_NAME = 'customMetadata';

export const CASES = [
  {
    input: `type Query { name: String }`,
    expected: `type Query { name: String }`,
    description: 'should leave unchanged schema without metadata'
  },
  {
    input: `type Query { name: String, ${DEFAULT_OPTIONS.metadataQueryName}: String }`,
    expected: `type Query { name: String }`,
    description: 'should remove metadata query from schema when it is named by default'
  },
  {
    input: `type Query { name: String, ${CUSTOM_METADATA_NAME}: String }`,
    expected: `type Query { name: String }`,
    metadataQueryName: CUSTOM_METADATA_NAME,
    description: 'should remove metadata query from schema when it has customized name'
  },
  {
    input:
    `
      type Metadata {
        name: String
      }
    
      type Query
      {
          name: String, 
          ${DEFAULT_OPTIONS.metadataQueryName}: Metadata
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata query from schema when it is named by default'
  },
  {
    input: `
      type Metadata {
        id: String!
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata type when query returns array'
  },
  {
    input: `
      type Metadata {
        id: String!
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: Metadata!  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata type when query returns non-nulls'
  },
  {
    input: `
      type Metadata {
        id: String!
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]!
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata type when query returns non-null array'
  },
  {
    input: `
      type Metadata {
        id: String!
        names: [String]
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata type when other type returns array'
  },
  {
    input: `
      type MetadataName {
        value: String
      }
    
      type Metadata {
        name: MetadataName!
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: Metadata
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata type when other type returns non-null'
  },
  {
    input: `
      type Metadata {
        id: String!
        meta: Metadata
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: Metadata
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata type when it is recursive'
  },
  {
    input: `
      type MetadataItem {
        parentMetadata: Metadata
      }
    
      type Metadata {
        items: [MetadataItem]
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata subgraph when it has cycle'
  },
  {
    input: `
      type FieldMetadata implements Metadata {
        name: String
        type: String
        field: String
        args: [String]
      }
      
      type ObjectMetadata implements Metadata {
        name: String
        type: String
      } 
    
      interface Metadata {
        name: String!
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata subgraph when it has interface'
  },
  {
    input: `
      type FieldMetadata {
        name: String
        type: String
        field: String
        args: [String]
      }
      
      type ObjectMetadata {
        name: String
        type: String
      } 
    
      union Metadata = FieldMetadata | ObjectMetadata
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata subgraph when it has union'
  },
  {
    input: `
      input MetadataFilter {
        value: String!
      }
    
      type Metadata {
        id: String!
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}(filter: MetadataFilter): [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata subgraph when it has inputs on query'
  },
  {
    input: `
      input ArgumentsFilter {
        name: String!
      }
    
      type MetadataArgument {
        name: String
        value: String
      }
    
      type Metadata {
        id: String!
        args (filter: ArgumentsFilter): [MetadataArgument]
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata subgraph when it has inputs on non-query type'
  },
  {
    input: `   
      type Metadata {
        query: Query
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `type Query { name: String }`,
    description: 'should remove metadata subgraph when unerlying type returns Query type'
  },
  {
    input: `   
      type Metadata {
        mutation: Mutation
      }
      
      type Mutation {
        action: Int
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `
      type Query { name: String }
      type Mutation { action: Int } 
    `,
    description: 'should remove metadata subgraph when unerlying type returns Mutation type'
  },
  {
    input: `   
      type Metadata {
        subscription: Subscription
      }
      
      type Subscription {
        action: Int
      }
    
      type Query {
        name: String
        ${DEFAULT_OPTIONS.metadataQueryName}: [Metadata]  
      }
    `,
    expected: `
      type Query { name: String }
      type Subscription { action: Int } 
    `,
    description: 'should remove metadata subgraph when unerlying type returns Subscription type'
  }
];