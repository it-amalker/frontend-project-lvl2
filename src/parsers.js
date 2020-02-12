import yaml from 'js-yaml';
import ini from 'ini';
import { replaceNumericStrings } from './utils';

export default (data, dataType) => {
  const getParser = (typeOfData) => {
    switch (typeOfData) {
      case 'json':
        return JSON.parse;
      case 'yml':
        return yaml.safeLoad;
      case 'ini':
        return ini.parse;
      default:
        throw new Error('Unsupported data type');
    }
  };
  const parse = getParser(dataType);
  return dataType === 'ini' ? replaceNumericStrings(parse(data)) : parse(data);
};
