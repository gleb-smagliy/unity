export const EFFECTS = {
  CALL: 'EFFECTS/CALL'
};

const call = (func, ...args) => ({
  operation: EFFECTS.CALL,
  func,
  args
});

export const effects = {
  call
};