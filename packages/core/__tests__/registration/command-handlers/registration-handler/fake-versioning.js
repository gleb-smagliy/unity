export const NEW_VERSION = 'zzzz-xxxx-yyyy';

export const createFakeVersioning = () => ({
  createVersion: jest.fn().mockReturnValue({ version: NEW_VERSION })
});