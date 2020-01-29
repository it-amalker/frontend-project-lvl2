import parse from './parsers';
import genDiff from './diff';
import defaultRender from './formatters/defaultRender';
import plainRender from './formatters/plain';
import jsonRender from './formatters/json';

export default (pathToFile1, pathToFile2, format) => {
  const getRenderer = (outputFormat) => {
    switch (outputFormat) {
      case 'plain':
        return plainRender;
      case 'json':
        return jsonRender;
      default:
        return defaultRender;
    }
  };
  const render = getRenderer(format);
  const filesDifference = genDiff(parse(pathToFile1), parse(pathToFile2));
  return render(filesDifference);
};
