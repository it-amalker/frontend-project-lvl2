import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';
import path from 'path';

export default (pathToFile) => {
  const formats = {
    json: { extension: '', parserType: JSON.parse },
    yaml: { extension: '.yml', parserType: yaml.safeLoad },
  };
  const fileExtension = path.extname(pathToFile);
  const data = fs.readFileSync(pathToFile);
  const fileFormat = _.findKey(formats, ['extension', fileExtension]);
  const parser = formats[fileFormat].parserType;
  const result = parser(data);

  return result === null ? '' : result;
};
