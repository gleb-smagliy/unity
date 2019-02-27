export const success = (payload, warnings = []) => ({
  success: true,
  warnings: warnings.map(stringToWarning),
  payload
});

export const error = (error, warnings = []) => ({
  success: true,
  error: stringToError(error),
  warnings: warnings.map(stringToWarning)
});

const stringToWarning = message => ({ message });

const stringToError = message => ({ message });