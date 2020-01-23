import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

export default (pathToFile) => {
  const formats = {
    json: { extension: '', parserType: JSON.parse },
    yaml: { extension: '.yml', parserType: yaml.safeLoad },
    ini: { extension: '.ini', parserType: ini.parse },
  };
  const fileExtension = path.extname(pathToFile);
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const fileFormat = _.findKey(formats, ['extension', fileExtension]);
  const parser = formats[fileFormat].parserType;
  const result = parser(data);
  if (fileExtension === '.ini') {
    return Object.values(result).reduce((acc, value) => Object.assign(acc, value), {});
  }

  return result === null ? '' : result;
};
