"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegistrationCommitingHandler = void 0;

var _sagaRunner = require("../../../common-modules/saga-runner");

var _systemTags = require("../constants/system-tags");

var _locking = require("../../modules/locking");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function* registrationCommitingSaga({
  locking,
  tagSchema
}, {
  version,
  args
}) {
  const lockState = yield _sagaRunner.effects.call(locking.getLockState);

  if (lockState === _locking.LOCK_STATE.NOT_ACQURIED) {
    return {
      success: false,
      error: 'Lock needed and is not acquired. Failed to commit.'
    };
  }

  yield _sagaRunner.effects.call(tagSchema, {
    version,
    tag: _systemTags.SYSTEM_TAGS.STABLE,
    args
  });
  yield _sagaRunner.effects.call(locking.releaseLock);
  return {
    success: true
  };
}

class RegistrationCommitingHandler {
  constructor({
    schemaVersionTaggingHandler
  }, options) {
    _defineProperty(this, "execute", async ({
      version,
      tag,
      args
    }) => {
      const {
        locking
      } = this.options;
      const tagSchema = this.tagSchema;
      const saga = registrationCommitingSaga({
        locking,
        tagSchema
      }, {
        version,
        args
      });
      return await (0, _sagaRunner.runSaga)(saga);
    });

    this.options = options;
    this.tagSchema = schemaVersionTaggingHandler.execute;
  }

}

exports.RegistrationCommitingHandler = RegistrationCommitingHandler;