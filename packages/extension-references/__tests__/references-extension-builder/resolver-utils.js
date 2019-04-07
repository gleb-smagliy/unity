export const createInfo = (delegationResult) =>
{
  return {
    delegationResult,
    info: {
      schema: { s1: 1 },
      mergeInfo: {
        delegateToSchema: jest.fn().mockResolvedValue(delegationResult)
      }
    }
  };
};