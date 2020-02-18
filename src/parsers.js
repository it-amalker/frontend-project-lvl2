import yaml from 'js-yaml';
import ini from 'ini';
import { replaceNumericStrings } from './utils';

export default (data, dataType) => {
  switch (dataType) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.safeLoad(data);
    case 'ini':
      return replaceNumericStrings(ini.parse(data));
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
};
