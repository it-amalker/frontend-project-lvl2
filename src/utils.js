export const isObject = (...items) => items.every((obj) => obj instanceof Object);
export const isArray = (...items) => items.every((arr) => Array.isArray(arr));
export const isExactlyObject = (...items) => items.every((obj) => isObject(obj) && !isArray(obj));
export const compareArray = (arr1, arr2) => arr1.every((el) => arr2.includes(el));
export const stringify = (str) => (typeof str === 'string' ? str.replace(/(^")|("$)/g, '') : str);
