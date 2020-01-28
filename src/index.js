import parse from './parsers';
import diff from './diff';
import defaultRender from './formatters/defaultRender';
import plainRender from './formatters/plain';


export default (pathToFile1, pathToFile2, format) => {
  const getRenderer = (outputFormat) => {
    switch (outputFormat) {
      case 'plain':
        return plainRender;
      // case 'json':
        // return json;
      default:
        return defaultRender;
    }
  };
  const render = getRenderer(format);

  return render(diff(parse(pathToFile1), parse(pathToFile2)));
};
