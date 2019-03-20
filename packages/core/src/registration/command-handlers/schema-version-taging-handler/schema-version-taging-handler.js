export class SchemaVersionTaggingHandler
{
  constructor(options)
  {
    this.options = options;
  }

  tagVersion = ({ version, tag }) =>
  {
    const { storage: { upsertTag } } = this.options;
  };
}