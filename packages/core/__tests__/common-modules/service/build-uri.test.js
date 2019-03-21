import { buildUri } from '../../../src/common-modules/services/build-uri';

describe('buildUri', () =>
{
  it('should return success with original string if no args passed and no placeholders exist in original string', () =>
  {
    const original = 'http://localhost/graphql';
    const expected = original;
    const args = {};

    expect(buildUri(original, args)).toBeSuccessful(expected);
  });

  it('should return success with oirignal string if no placeholder exist in original string and some args passed', () =>
  {
    const original = 'http://localhost/graphql';
    const expected = original;
    const args = { key1: 'hello' };

    expect(buildUri(original, args)).toBeSuccessful(expected);
  });

  it('should return failure if no args passed and some placeholers present in original string', () =>
  {
    const original = 'http://localhost/[arg1]';
    const args = { };

    expect(buildUri(original, args)).toBeFailed();
  });

  it('should return failure if some placeholers left unreplaced in original string', () =>
  {
    const original = 'http://localhost/[arg1]/[arg2]';
    const args = { arg1: 'prod' };

    expect(buildUri(original, args)).toBeFailed();
  });

  it('should replace args placeholder in original string if one arg passed', () =>
  {
    const original = 'http://localhost/[key1]/graphql';
    const expected = 'http://localhost/prod/graphql';
    const args = { key1: 'prod' };

    expect(buildUri(original, args)).toBeSuccessful(expected);
  });

  it('should replace args placeholders in original string if two args passed', () =>
  {
    const original = 'http://localhost/[key1]/[key2]/graphql';
    const expected = 'http://localhost/prod/v1/graphql';
    const args = { key1: 'prod', key2: 'v1' };

    expect(buildUri(original, args)).toBeSuccessful(expected);
  });

  it('should return original string if no args passed', () =>
  {
    const original = 'http://localhost/graphql';
    const expected = original;

    expect(buildUri(original)).toBeSuccessful(expected);
  });
});