import fs from 'fs';
import path from 'path';
import parse from './parsers';
import genDiff from './diff';
import getRenderer from './formatters/index';

const getParsedData = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const extension = path.extname(pathToFile);
  return parse(data, extension);
};

export default (pathToFile1, pathToFile2, format) => {
  const render = getRenderer(format);
  const difference = genDiff(getParsedData(pathToFile1), getParsedData(pathToFile2));

  return render(difference);
};
