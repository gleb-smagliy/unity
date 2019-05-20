const { createStorage } = require('@soyuz/storage-dynamodb');

const {
    DYNAMODB_PORT,
    TAGS_TABLE,
    SCHEMAS_TABLE
} = process.env;

const clientOptions = {
    region: 'localhost',
    endpoint: `http://localhost:${DYNAMODB_PORT}`,
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
};

module.exports.createStorage = () => createStorage({
    clientOptions,
    tables: {
        schema: SCHEMAS_TABLE,
        tags: TAGS_TABLE
    }
});
