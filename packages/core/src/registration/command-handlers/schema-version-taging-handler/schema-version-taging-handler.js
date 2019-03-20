import { runSaga, effects } from "../../../common-modules/saga-runner";

function* schemaTaggingSaga({
  upsertTag,
  getSchemaByVersion,
  args: { version, tag, stage }
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

  yield effects.call(upsertTag, { version, tag, stage });

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

  execute = async ({ version, tag, stage }) =>
  {
    const { upsertTag } = this.options.storage.commands;
    const { getSchemaByVersion } = this.options.storage.queries;

    const saga = schemaTaggingSaga({
      upsertTag,
      getSchemaByVersion,
      args: {
        version,
        tag,
        stage
      }
    });

    return await runSaga(saga);
  };
}