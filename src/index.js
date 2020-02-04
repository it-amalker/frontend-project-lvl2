import parse from './parsers';
import genDiff from './diff';
import getRenderer from './formatters/index';

export default (pathToFile1, pathToFile2, format) => {
  const render = getRenderer(format);
  const difference = genDiff(parse(pathToFile1), parse(pathToFile2));

  return render(difference);
};
