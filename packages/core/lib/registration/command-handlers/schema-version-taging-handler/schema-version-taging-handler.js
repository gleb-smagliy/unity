"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaVersionTaggingHandler = void 0;

var _sagaRunner = require("../../../common-modules/saga-runner");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function* schemaTaggingSaga({
  upsertTag,
  getSchemaByVersion,
  args: {
    version,
    tag,
    stage
  }
}) {
  const {
    services
  } = yield _sagaRunner.effects.call(getSchemaByVersion, {
    version
  });

  if (services.length === 0) {
    return {
      success: false,
      error: `There are no services of <${version}> version`
    };
  }

  yield _sagaRunner.effects.call(upsertTag, {
    version,
    tag,
    stage
  });
  return {
    success: true
  };
}

class SchemaVersionTaggingHandler {
  constructor(options) {
    _defineProperty(this, "execute", async ({
      version,
      tag,
      stage
    }) => {
      const {
        upsertTag
      } = this.options.storage.commands;
      const {
        getSchemaByVersion
      } = this.options.storage.queries;
      const saga = schemaTaggingSaga({
        upsertTag,
        getSchemaByVersion,
        args: {
          version,
          tag,
          stage
        }
      });
      return await (0, _sagaRunner.runSaga)(saga);
    });

    this.options = options;
  }

}

exports.SchemaVersionTaggingHandler = SchemaVersionTaggingHandler;