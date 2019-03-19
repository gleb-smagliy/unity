export const ZERO_VERSION = "0";

export class IncrementalVersioning
{
  createVersion = ({ currentVersion }) =>
  {
    if(currentVersion == null)
    {
      return {
        success: true,
        payload: {
          version: ZERO_VERSION
        }
      }
    }

    const prevVersion = parseInt(currentVersion);

    if(isNaN(prevVersion))
    {
      return {
        success: false,
        error: `Expected version to be a number, but <${currentVersion}> given`
      }
    }

    return {
      success: true,
      payload: {
        version: (prevVersion + 1).toString()
      }
    }
  };
}