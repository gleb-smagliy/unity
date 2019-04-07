import { schemaContextEnhancer, getSchemaFromContext } from '../../../src/request/context/schema-context-enhancer';

describe('schemaContextEnhancer', () =>
{
  it('should return schema object with batchQuery method if using getSchemaFromContext', async () =>
  {
    const context = schemaContextEnhancer();
    const schema = getSchemaFromContext(context);

    expect(typeof(schema.batchQuery)).toEqual('function');
  });

  it('should return schema object with batchQueryMany method if using getSchemaFromContext', async () =>
  {
    const context = schemaContextEnhancer();
    const schema = getSchemaFromContext(context);

    expect(typeof(schema.batchQueryMany)).toEqual('function');
  });
});