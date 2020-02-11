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
        return null;
    }
  };
  const parse = getParser(dataType);
  const parsedData = parse(data);
  return dataType === '.ini' ? replaceNumericStrings(parsedData) : parsedData;
};
