import { tryGetName } from "../../../src/common-modules/plugins";

describe('tryGetName', () =>
{
  it('should return success with class name when class instance is passed', () =>
  {
    class SomePlugin {}

    expect(tryGetName(new SomePlugin())).toBeSuccessful('SomePlugin');
  });

  it('should return success with name property when object is passed', () =>
  {
    const plugin = { name: 'some_plugin' };

    expect(tryGetName(plugin)).toBeSuccessful(plugin.name);
  });

  it('should return failure when object without name is passed', () =>
  {
    const plugin = { someProp: 'some_plugin' };

    expect(tryGetName(plugin)).toBeFailed();
  });

  it('should return failure when not object is passed', () =>
  {
    expect(tryGetName('some_plugin')).toBeFailed();
  });
});