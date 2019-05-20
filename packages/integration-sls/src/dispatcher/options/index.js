const { graphqlSchemaBuilder } = require('@soyuz/schema-builder-graphql');
const { IncrementalVersioning } = require('@soyuz/versioning-incremental');
const { ReferencesExtensionBuilder } = require('@soyuz/extension-references');
const { createStorage } = require('./storage');
const { createLocking } = require('./locking');

module.exports.options = {
    storage: createStorage(),
    versioning: new IncrementalVersioning(),
    extensionBuilders: [
        new ReferencesExtensionBuilder()
    ],
    schemaBuilders: [
        graphqlSchemaBuilder()
    ],
    locking: createLocking()
};