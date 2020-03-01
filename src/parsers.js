import yaml from 'js-yaml';
import ini from 'ini';
import { replaceNumericStrings } from './utils';

const mapping = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: (data) => replaceNumericStrings(ini.parse(data)),
};

export default (data, dataType) => mapping[dataType](data);
