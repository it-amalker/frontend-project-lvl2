import _ from 'lodash';
import { stringify } from '../utils';

const prerenderValue = (item) => (_.isObject(item) ? '[complex value]' : `'${stringify(JSON.stringify(item))}'`);

export default (ast) => {
  const iterAst = (tree, path) => {
    const renderedResult = tree.reduce((acc, node) => {
      const {
        name, status, type, valueBefore, valueAfter, children,
      } = node;
      const currentPath = path === '' ? `${path}${name}` : `${path}.${name}`;
      const renderNode = (nodeStatus) => {
        if (type === 'children') {
          return [...acc, `${iterAst(children, currentPath)}`];
        }
        const newValueBefore = prerenderValue(valueBefore);
        const newValueAfter = prerenderValue(valueAfter);
        switch (nodeStatus) {
          case 'added':
            return [...acc, `Property '${currentPath}' was added with value: ${newValueAfter}`];
          case 'removed':
            return [...acc, `Property '${currentPath}' was deleted`];
          case 'changed':
            return [...acc, `Property '${currentPath}' was changed. From ${newValueBefore} to ${newValueAfter}`];
          case 'unchanged':
            return acc;
          default:
            throw new Error(`Unknown ${status} status`);
        }
      };
      return renderNode(status);
    }, []);
    return `${renderedResult.join('\n')}`;
  };
  return iterAst(ast, '');
};
