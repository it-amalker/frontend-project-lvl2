import _ from 'lodash';
import parser from './parsers';

export default (pathToFile1, pathToFile2) => {
  const firstObj = parser(pathToFile1);
  const secondObj = parser(pathToFile2);

  const compareArray = Object.entries(firstObj).sort().reduce((acc, [key, value]) => {
    const isKeyEntry = _.has(secondObj, key);
    if (isKeyEntry) {
      return (value === (secondObj[key])
        ? [...acc, `    ${key}: ${value}`]
        : [...acc, `  + ${key}: ${secondObj[key]}`, `  - ${key}: ${value}`]
      );
    }
    return [...acc, `  - ${key}: ${value}`];
  }, []);

  const result = Object.entries(secondObj).reduce((acc, [key, value]) => (_.has(firstObj, key)
    ? acc
    : [...acc, `  + ${key}: ${value}`]
  ), compareArray);

  return `{\n${result.join('\n')}\n}`;
};
