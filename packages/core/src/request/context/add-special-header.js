export const SPECIAL_HEADERS_SYMBOL = Symbol('SPECIAL_HEADERS');
export const SPECIAL_HEADERS_PREFIX = 'x-soyuz';

export const addSpecialHeader = (context, name, value) =>
{
  const prevHeaders = context[SPECIAL_HEADERS_SYMBOL] || {};

  return {
    ...context,
    [SPECIAL_HEADERS_SYMBOL]: {
      ...prevHeaders,
      [`${SPECIAL_HEADERS_PREFIX}-${name}`]: value
    }
  }
};

export const getSpecialHeaders = (context) => {
  return context[SPECIAL_HEADERS_SYMBOL] || {};
};