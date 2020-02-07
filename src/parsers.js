import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';
import { replaceNumericStrings } from './utils';

export default (data, extension) => {
  const formats = {
    json: { extension: '.json', parserType: JSON.parse },
    yaml: { extension: '.yml', parserType: yaml.safeLoad },
    ini: { extension: '.ini', parserType: ini.parse },
  };
  const format = _.findKey(formats, ['extension', extension]);
  const parse = formats[format].parserType;
  const parsedData = parse(data);

  return extension === '.ini' ? replaceNumericStrings(parsedData) : parsedData;
};
