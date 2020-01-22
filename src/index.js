import fs from 'fs';
import _ from 'lodash';

export default (pathToFile1, pathToFile2) => {
  const firstObj = JSON.parse(fs.readFileSync(pathToFile1));
  const secondObj = JSON.parse(fs.readFileSync(pathToFile2));

  const objCompare = Object.entries(firstObj).reduce((acc, [key, value]) => {
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
  ), objCompare);

  return `{\n${result.join('\n')}\n}`;
};
