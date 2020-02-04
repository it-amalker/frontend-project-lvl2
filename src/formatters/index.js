import standardRender from './standard';
import plainRender from './plain';
import jsonRender from './json';

export default (outputFormat) => {
  switch (outputFormat) {
    case 'plain':
      return plainRender;
    case 'json':
      return jsonRender;
    default:
      return standardRender;
  }
};
