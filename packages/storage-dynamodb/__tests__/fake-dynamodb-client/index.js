export const createSuccessfulScanClient = (table) => ({
  scan: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue(table)
  })
});

export const createFailedScanClient = () => ({
  scan: jest.fn().mockReturnValue({
    promise: jest.fn().mockRejectedValue(new Error())
  })
});

export const createSuccessfulQueryClient = (table) => ({
  query: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue(table)
  })
});

export const createFailedQueryClient = () => ({
  query: jest.fn().mockReturnValue({
    promise: jest.fn().mockRejectedValue(new Error())
  })
});