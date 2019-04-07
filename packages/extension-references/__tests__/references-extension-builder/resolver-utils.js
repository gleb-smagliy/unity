export const dataLoaderWait = () => new Promise((resolve, reject) => {
  process.nextTick(() => {
    process.nextTick(() => resolve());
  });
});

const infoPrototype = { i0: 1, i3: 2, i2: 3, schema: { s1: 1 } };

export const createInfo = (delegationResult) =>
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