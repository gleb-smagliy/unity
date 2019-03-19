export const NEW_VERSION = 'zzzz-xxxx-yyyy';

export const createSuccessfulFakeVersioning = () => ({
  createVersion: jest.fn().mockReturnValue({
    success: true,
    payload: {
      version: NEW_VERSION
    }
  })
});

export const createFailedFakeVersioning = () => ({
  createVersion: jest.fn().mockReturnValue({
    success: false,
    error: 'unknown error'
  })
});