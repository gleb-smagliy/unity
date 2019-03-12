/*
  {
    Version: String // HashKey
    PluginName: String // SortKey
    Metadata: String // Json serialized
  }
*/

export const PLUGINS_METADATA_TABLE = [
  {
    Version: '1_Plugins', // HashKey
    Id: 'ReferenceExtensionBuilder', // SortKey
    PluginMetadata: {
      extendType: 'User',
      onField: 'id',
      withField: 'organization',
      type: 'Organization',
      query: 'organizationByUserId',
      keys: [{ name: 'id' }]
    }
  }
];