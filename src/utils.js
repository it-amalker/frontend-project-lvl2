import _ from 'lodash';

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
