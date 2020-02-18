import _ from 'lodash';
import { stringify } from '../utils';

const prerenderValue = (item) => (_.isObject(item) ? '[complex value]' : `'${stringify(JSON.stringify(item))}'`);

export default (ast) => {
  const iterAst = (tree, path) => {
    const renderedResult = tree.map((node) => {
      const {
        name, type, valueBefore, valueAfter, children,
      } = node;
      const currentPath = path === '' ? `${path}${name}` : `${path}.${name}`;
      const renderNode = (nodeType) => {
        const newValueBefore = prerenderValue(valueBefore);
        const newValueAfter = prerenderValue(valueAfter);
        switch (nodeType) {
          case 'children':
            return `${iterAst(children, currentPath)}\n`;
          case 'added':
            return `Property '${currentPath}' was added with value: ${newValueAfter}\n`;
          case 'removed':
            return `Property '${currentPath}' was deleted\n`;
          case 'changed':
            return `Property '${currentPath}' was changed. From ${newValueBefore} to ${newValueAfter}\n`;
          case 'unchanged':
            return '';
          default:
            throw new Error(`Unknown node type: ${type}`);
        }
      };
      return renderNode(type);
    }).join('');
    return renderedResult.replace(/\n$/, '');
  };
  return iterAst(ast, '');
};
