import { isValidTransform } from "../../../src/common-modules/plugins";

describe('isValidTransform', () =>
{
  it('should return true when non-null object is passed', () =>
  {
    expect(isValidTransform({})).toBeTruthy();
  });

  it('should return false when null object is passed', () =>
  {
    expect(isValidTransform(null)).toBeFalsy();
  });

  it('should return false when non-object is passed', () =>
  {
    expect(isValidTransform(123)).toBeFalsy();
  });
});