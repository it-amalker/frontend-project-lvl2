import yaml from 'js-yaml';
import ini from 'ini';
import { replaceNumericStrings } from './utils';

const getParser = (dataType) => {
  switch (dataType) {
    case 'json':
      return JSON.parse;
    case 'yml':
      return yaml.safeLoad;
    case 'ini':
      return ini.parse;
    default:
      throw new Error(`Unsupported ${dataType} data type`);
  }
};

export default (data, dataType) => {
  const parse = getParser(dataType);
  return dataType === 'ini' ? replaceNumericStrings(parse(data)) : parse(data);
};
