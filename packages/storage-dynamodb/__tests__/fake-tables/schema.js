import { buildFakeClientSchema } from './build-fake-client-schema';

export const SERVICE = {
  Version: "1", // HashKey
  Id: "SERVICE/User", // SortKey
  Type: "SERVICE",
  ServiceId: "User",
  Schema: buildFakeClientSchema(`
      type Query {
        dummy: String
      }
    `),
  Metadata: [
    {
      name: 'ref', location: 'OBJECT_FIELD',
      arguments: [
        { name: 'query', value: "\"friendById\"" },
        { name: 'as', value: "\"friend\"" }
      ]
    },
    {
      name: 'key', location: 'OBJECT_TYPE',
      arguments: [
        { name: 'query', value: "[\"id\", \"name\"]" },
      ]
    }
  ],
  Endpoint: "localhost/[stage]",
  Stage: "test"
};

export const PLUGIN_METADATA = {
  Version: "1", //HashKey
  Id: "PLUGIN_METADATA/ReferenceExtensionBuilder", // SortKey
  Type: "PLUGIN_METADATA",
  PluginName: "ReferenceExtensionBuilder",
  Metadata: {
    extendTypes: [
      {
        name: 'User',
        keyFields: [{ name: 'id', type: 'Int!' }],
        asField: 'friends',
        query: 'Friends.friendsByUserId',
        type: '[Friends_Friend]',
        keysArgs: [{ name: 'userId', type: 'Int!' }],
        additinalArgs: [{ name: 'hideBlocked', type: 'Boolean!' }]
      }
    ]
  }
};

export const SCHEMA_TABLE =
[
  SERVICE,
  PLUGIN_METADATA
];