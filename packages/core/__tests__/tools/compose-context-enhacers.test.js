import { composeContextEnhancers } from '../../src/tools/compose-context-enchancers';

describe('composeContextEnhancers', () =>
{
  it('should return composed object when function is passed', async () =>
  {
    const result = { key: 'value' };
    const func = jest.fn().mockReturnValue(result);

    const enhancer = composeContextEnhancers(func);

    expect(enhancer()).toEqual(result);
  });

  it('should return composed object when object is passed', async () =>
  {
    const result1 = { key1: 'value1' };
    const result2 = { key2: 'value2' };

    const func1 = jest.fn().mockReturnValue(result1);
    const func2 = jest.fn().mockReturnValue(result2);

    const enhancer = composeContextEnhancers({ func1, func2 });

    expect(enhancer()).toEqual({
      func1: result1,
      func2: result2
    });
  });

  it('should be nestable with sub-functions', async () =>
  {
    const result1 = { key1: 'value1' };
    const result2 = { key2: 'value2' };
    const nested = { nestedKey: 'nested_value' };

    const func1 = jest.fn().mockReturnValue(result1);
    const func2 = jest.fn().mockReturnValue(result2);
    const nestedFunc = jest.fn().mockReturnValue(nested);

    const enhancer = composeContextEnhancers({
      func1,
      func2,
      complex: composeContextEnhancers({ nested: nestedFunc })
    });

    expect(enhancer()).toEqual({
      func1: result1,
      func2: result2,
      complex: { nested }
    });
  });

  it('should pass arguments to sub-functions', async () =>
  {
    const args = [{ arg1: 'v1'}, { req: 'request' }];

    const result1 = { key1: 'value1' };
    const result2 = { key2: 'value2' };

    const func1 = jest.fn().mockReturnValue(result1);
    const func2 = jest.fn().mockReturnValue(result2);

    const enhancer = composeContextEnhancers({ func1, func2 });

    enhancer(...args);

    expect(func1).toHaveBeenCalledWith(...args);
    expect(func2).toHaveBeenCalledWith(...args);
  });

  it('should be nestable with mixed sub-functions/objects', async () =>
  {
    const result1 = { key1: 'value1' };
    const result2 = { key2: 'value2' };
    const nested = { nestedKey: 'nested_value' };

    const func2 = jest.fn().mockReturnValue(result2);
    const nestedFunc = jest.fn().mockReturnValue(nested);

    const enhancer = composeContextEnhancers({
      result1,
      func2,
      complex: composeContextEnhancers({ nested: nestedFunc })
    });

    expect(enhancer()).toEqual({
      result1,
      func2: result2,
      complex: { nested }
    });
  });

  it('should return empty object if no enhancers passed', async () =>
  {
    expect(composeContextEnhancers()()).toEqual({});
  });
});