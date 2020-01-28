export const isObject = (...items) => items.every((obj) => obj instanceof Object);
export const isArray = (...items) => items.every((arr) => Array.isArray(arr));
export const stringify = (str) => (typeof str === 'string' ? str.replace(/(^")|("$)/g, '') : str);
