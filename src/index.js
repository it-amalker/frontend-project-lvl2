import parse from './parsers';
import diff from './diff';
import defaultRenderer from './formatters/defaulRenderer';
import plain from './formatters/plain';


export default (pathToFile1, pathToFile2, format) => {
  const getRenderer = (outputFormat) => {
    switch (outputFormat) {
      case 'plain':
        return plain;
      // case 'json':
        // return json;
      default:
        return defaultRenderer;
    }
  };
  const render = getRenderer(format);

  return render(diff(parse(pathToFile1), parse(pathToFile2)));
};
