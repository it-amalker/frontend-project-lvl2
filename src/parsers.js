import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import { convertNums } from './utils';

const getParser = (filePath) => {
  const formats = {
    json: { extension: '', parserType: JSON.parse },
    yaml: { extension: '.yml', parserType: yaml.safeLoad },
    ini: { extension: '.ini', parserType: ini.parse },
  };
  const fileExtension = path.extname(filePath);
  const fileFormat = _.findKey(formats, ['extension', fileExtension]);
  const parser = formats[fileFormat].parserType;

  return { parser, fileExtension };
};

export default (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const { parser: parse, fileExtension } = getParser(pathToFile);
  const parsedData = parse(data);
  if (fileExtension === '.ini') {
    return convertNums(parsedData);
  }

  return parsedData === null ? '' : parsedData;
};
