import { createQuery, createQueryMany } from '../../../src/request/context/batched-query';

const dataLoaderWait = () => new Promise((resolve, reject) => {
  process.nextTick(() => {
    process.nextTick(() => resolve());
  });
});

const fieldName = '123456';
const context = { c0: 0, c1: 1, c2: 2 };
const infoPrototype = { i0: 1, i3: 2, i2: 3, schema: { s1: 1 } };

const createInfo = (delegationResult) =>
{
  return {
    delegationResult,
    info: {
      ...infoPrototype,
      mergeInfo: {
        delegateToSchema: jest.fn().mockResolvedValue(delegationResult)
      }
    }
  };
};

// const cache = {};

describe('query', () =>
{
  let query;

  beforeEach(() => {
    let cache = {};
    query = createQuery(cache);
  });

  it('should return value for many calls in batch on next tick', async () =>
  {
    const { info, delegationResult } = createInfo([{ r1: 1 }, { r2: 2 }]);

    const arg1 = { ids: 123 };
    const arg2 = { ids: 312 };

    const result1Promise = query({ query: fieldName, args: arg1, context, info });
    const result2Promise = query({ query: fieldName, args: arg2, context, info });

    await dataLoaderWait();

    expect(await result1Promise).toEqual(delegationResult[0]);
    expect(await result2Promise).toEqual(delegationResult[1]);
  });

  it('should call delegateToSchema with right args', async () =>
  {
    const { info } = createInfo([{ r1: 1 }, { r2: 2 }]);

    const arg1 = { ids: 123 };
    const arg2 = { ids: 312 };

    query({ query: fieldName, args: arg1, context, info });
    query({ query: fieldName, args: arg2, context, info });

    await dataLoaderWait();

    expect(info.mergeInfo.delegateToSchema).toHaveBeenCalledWith({
      schema: infoPrototype.schema,
      operation: 'query',
      fieldName,
      args: {
        ids: [123, 312]
      },
      context,
      info
    });
  });

  it('should return cached result if keys match', async () =>
  {
    const { info, delegationResult } = createInfo([{ r1: 1 }]);

    const arg1 = { ids: 123 };

    const result1Promise = query({ query: fieldName, args: arg1, context, info });
    const result2Promise = query({ query: fieldName, args: arg1, context, info });

    await dataLoaderWait();

    expect(await result1Promise).toEqual(delegationResult[0]);
    expect(await result2Promise).toEqual(delegationResult[0]);
  });

  it('should call delegateToSchema with right args if keys match', async () =>
  {
    const { info } = createInfo([{ r1: 1 }]);

    const arg1 = { ids: 123 };

    query({ query: fieldName, args: arg1, context, info });
    query({ query: fieldName, args: arg1, context, info });

    await dataLoaderWait();

    expect(info.mergeInfo.delegateToSchema).toHaveBeenCalledWith({
      schema: infoPrototype.schema,
      operation: 'query',
      fieldName,
      args: {
        ids: [123]
      },
      context,
      info
    });
  });
});

describe('queryMany', () =>
{
  let query;

  beforeEach(() => {
    let cache = {};
    query = createQueryMany(cache);
  });

  it('should execute query in batch on next tick using passed function if many arguments passed', async () =>
  {
    const { info, delegationResult } = createInfo([{ r1: 1 }, { r2: 2 }, { r3: 3 }, { r4: 4 }]);

    const arg1 = [{ ids: 111 }, { ids: 222 }];
    const arg2 = [{ ids: 333 }, { ids: 444 }];

    const result1Promise = query({ query: fieldName, args: arg1, context, info });
    const result2Promise = query({ query: fieldName, args: arg2, context, info });

    await dataLoaderWait();

    expect(await result1Promise).toEqual([delegationResult[0], delegationResult[1]]);
    expect(await result2Promise).toEqual([delegationResult[2], delegationResult[3]]);
  });

  it('should call delegateToSchema with right args', async () =>
  {
    const { info } = createInfo([{ r1: 1 }, { r2: 2 }, { r3: 3 }, { r4: 4 }]);

    const arg1 = [{ ids: 111 }, { ids: 222 }];
    const arg2 = [{ ids: 333 }, { ids: 444 }];

    query({ query: fieldName, args: arg1, context, info });
    query({ query: fieldName, args: arg2, context, info });

    await dataLoaderWait();
    expect(info.mergeInfo.delegateToSchema).toHaveBeenCalledWith({
      schema: infoPrototype.schema,
      operation: 'query',
      fieldName,
      args: {
        ids: [111, 222, 333, 444]
      },
      context,
      info
    });
  });

  it('should return cached result if keys fully match', async () =>
  {
    const { info, delegationResult } = createInfo([{ r1: 1 }, { r2: 2 }]);

    const arg1 = [{ ids: 111 }, { ids: 222 }];
    const arg2 = [{ ids: 111 }, { ids: 222 }];

    const result1Promise = query({ query: fieldName, args: arg1, context, info });
    const result2Promise = query({ query: fieldName, args: arg2, context, info });

    await dataLoaderWait();

    expect(await result1Promise).toEqual([delegationResult[0], delegationResult[1]]);
    expect(await result2Promise).toEqual([delegationResult[0], delegationResult[1]]);
  });

  it('should return cached result if keys partially match', async () =>
  {
    const { info, delegationResult } = createInfo([{ r1: 1 }, { r2: 2 }, { r3: 3 }]);

    const arg1 = [{ ids: 111 }, { ids: 222 }];
    const arg2 = [{ ids: 111 }, { ids: 333 }];

    const result1Promise = query({ query: fieldName, args: arg1, context, info });
    const result2Promise = query({ query: fieldName, args: arg2, context, info });

    await dataLoaderWait();

    expect(await result1Promise).toEqual([delegationResult[0], delegationResult[1]]);
    expect(await result2Promise).toEqual([delegationResult[0], delegationResult[2]]);
  });

  it('should call delegateToSchema with right args if keys fully match', async () =>
  {
    const { info } = createInfo([{r1: 1}, {r2: 2}]);

    const arg1 = [{ids: 111}, {ids: 222}];
    const arg2 = [{ids: 111}, {ids: 222}];

    query({query: fieldName, args: arg1, context, info});
    query({query: fieldName, args: arg2, context, info});

    await dataLoaderWait();

    expect(info.mergeInfo.delegateToSchema).toHaveBeenCalledWith({
      schema: infoPrototype.schema,
      operation: 'query',
      fieldName,
      args: {
        ids: [111, 222]
      },
      context,
      info
    });
  });
});