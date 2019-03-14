export const createSuccessfulBatchWriteClient = () => ({
  batchWrite: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({})
  })
});

export const createFailedBatchWriteClient = () => ({
  batchWrite: jest.fn().mockReturnValue({
    promise: jest.fn().mockRejectedValue(new Error())
  })
});

export const createSuccessfulPutClient = () => ({
  put: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({})
  })
});

export const createFailedPutClient = () => ({
  put: jest.fn().mockReturnValue({
    promise: jest.fn().mockRejectedValue(new Error())
  })
});

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