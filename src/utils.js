export const isObject = (...items) => items.every((obj) => obj instanceof Object);
export const isArray = (...items) => items.every((arr) => Array.isArray(arr));
export const isExactlyObject = (...items) => items.every((obj) => isObject(obj) && !isArray(obj));
export const isEquilArrays = (arr1, arr2) => arr1.every((el) => arr2.includes(el));
export const stringify = (str) => (typeof str === 'string' ? str.replace(/(^")|("$)/g, '') : str);
export const convertNums = (obj) => {
  const result = Object.entries(obj).reduce((acc, [key, value]) => {
    if (isObject(value)) {
      convertNums(value);
    }
    if (/^\d+$/.test(value)) {
      acc[key] = Number(value);
    }
    return acc;
  }, obj);
  return result;
};
