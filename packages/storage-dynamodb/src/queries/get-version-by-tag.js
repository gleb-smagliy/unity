export const getVersionByTag = async ({ tag }) => {
  return {
    success: true,
    payload: {
      version: '1',
      stage: 'dev'
    }
  };
};