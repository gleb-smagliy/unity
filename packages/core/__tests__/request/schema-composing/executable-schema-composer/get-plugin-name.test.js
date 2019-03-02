import { tryGetName } from "../../../../src/request/schema-composing/executable-schema-composer/get-plugin-name";

describe('tryGetName', () => {
  it('should return success with class name when class instance is passed', () => {
    class SomePlugin {}

    const getNameResult = tryGetName(new SomePlugin());

    expect(getNameResult.success).toEqual(true);
    expect(getNameResult.payload).toEqual('SomePlugin');
  });

  it('should return success with name property when object is passed', () => {
    const plugin = { name: 'some_plugin' };

    const getNameResult = tryGetName(plugin);

    expect(getNameResult.success).toEqual(true);
    expect(getNameResult.payload).toEqual(plugin.name);
  });

  it('should return failure when object without name is passed', () => {
    const plugin = { someProp: 'some_plugin' };

    const getNameResult = tryGetName(plugin);

    expect(getNameResult.success).toEqual(false);
    expect(getNameResult.error).toEqual(expect.any(String));
  });

  it('should return failure when not object is passed', () => {
    const getNameResult = tryGetName('some_plugin');

    expect(getNameResult.success).toEqual(false);
    expect(getNameResult.error).toEqual(expect.any(String));
  });
});