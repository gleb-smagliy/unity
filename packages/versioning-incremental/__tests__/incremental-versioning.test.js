import { IncrementalVersioning, ZERO_VERSION } from '../src/incremental-versioning';

describe('IncrementalVersioning', () =>
{
  it('should return successful result with zero version if null verison passed', () =>
  {
    const versioning = new IncrementalVersioning();

    expect(versioning.createVersion({ currentVersion: null })).toBeSuccessful({
      version: ZERO_VERSION
    });
  });

  it('should return failure if NaN passed', () =>
  {
    const versioning = new IncrementalVersioning();

    expect(versioning.createVersion({ currentVersion: "not a number" })).toBeFailed();
  });

  it('should return success with next version if number passed', () =>
  {
    const currentVersion = 123;
    const version = "124";

    const versioning = new IncrementalVersioning();

    expect(versioning.createVersion({ currentVersion })).toBeSuccessful({
      version
    });
  });

  it('should return success with next version if stringified number passed', () =>
  {
    const currentVersion = "999";
    const version = "1000";

    const versioning = new IncrementalVersioning();

    expect(versioning.createVersion({ currentVersion })).toBeSuccessful({
      version
    });
  });
});