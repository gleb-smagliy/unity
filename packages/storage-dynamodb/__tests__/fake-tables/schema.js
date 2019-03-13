import { buildFakeClientSchema } from './build-fake-client-schema';

export const SCHEMA_TABLE =
[
  {
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
          { name: 'query', type: 'String', value: "" }
        ]
      }

    ],
    Endpoint: "localhost",

  },
  {
    Version: "1", //HashKey
    Id: "PLUGIN_METADATA/ReferenceExtensionBuilder", // SortKey
    Type: "PLUGIN_METADATA",
    PluginName: "ReferenceExtensionBuilder",
    Metadata: {}
  },
];