import fs from 'fs';
import path from 'path';
import parse from './parsers';
import buildAst from './diff';
import getRenderer from './formatters/index';

const getParsedData = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const dataType = path.extname(pathToFile).substring(1);
  return parse(data, dataType);
};

export default (pathToFile1, pathToFile2, outputFormat) => {
  const render = getRenderer(outputFormat);
  const configFilesDifference = buildAst(getParsedData(pathToFile1), getParsedData(pathToFile2));

  return render(configFilesDifference);
};
