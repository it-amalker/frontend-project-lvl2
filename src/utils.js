import _ from 'lodash';

export const isObjectAndNotArray = (value1, value2) => (
  _.isObject(value1) && _.isObject(value2) && !_.isArray(value1) && !_.isArray(value2)
);
export const stringify = (str) => (typeof str === 'string' ? str.replace(/(^")|("$)/g, '') : str);
export const replaceNumericStrings = (obj) => {
  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (_.isObject(value)) {
      replaceNumericStrings(value);
    }
    if (/^\d+$/.test(value)) {
      acc[key] = Number(value);
    }
    return acc;
  }, { ...obj });
  return result;
};
