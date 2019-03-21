import { effects, runSaga } from '../../../common-modules/saga-runner';
import { SYSTEM_TAGS } from "../constants/system-tags";
import { LOCK_STATE } from "../../modules/locking";

function* registrationCommitingSaga(
  { locking, tagSchema },
  { version, args }
)
{
  const lockState = yield effects.call(locking.getLockState);

  if(lockState === LOCK_STATE.NOT_ACQURIED)
  {
    return {
      success: false,
      error: 'Lock needed and is not acquired. Failed to commit.'
    }
  }

  yield effects.call(tagSchema, { version, tag: SYSTEM_TAGS.STABLE, args });

  yield effects.call(locking.releaseLock);

  return {
    success: true
  };
}

export class RegistrationCommitingHandler
{
  constructor({ schemaVersionTaggingHandler }, options)
  {
    this.options = options;
    this.tagSchema = schemaVersionTaggingHandler.execute;
  }

  execute = async ({ version, tag, args }) =>
  {
    const { locking } = this.options;
    const tagSchema = this.tagSchema;

    const saga = registrationCommitingSaga(
      { locking, tagSchema },
      { version, args }
    );

    return await runSaga(saga);
  };
}