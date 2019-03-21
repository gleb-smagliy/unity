import { runSaga, effects } from "../../../common-modules/saga-runner";

function* schemaTaggingSaga({
  upsertTag,
  getSchemaByVersion,
  args: { version, tag, args }
})
{
  const { services } = yield effects.call(getSchemaByVersion, { version });

  if(services.length === 0)
  {
    return {
      success: false,
      error: `There are no services of <${version}> version`
    }
  }

  yield effects.call(upsertTag, { version, tag, args });

  return {
    success: true
  };
}

export class SchemaVersionTaggingHandler
{
  constructor(options)
  {
    this.options = options;
  }

  execute = async ({ version, tag, args }) =>
  {
    const { upsertTag } = this.options.storage.commands;
    const { getSchemaByVersion } = this.options.storage.queries;

    const saga = schemaTaggingSaga({
      upsertTag,
      getSchemaByVersion,
      args: {
        version,
        tag,
        args
      }
    });

    return await runSaga(saga);
  };
}