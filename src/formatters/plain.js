import _ from 'lodash';
import { stringify } from '../utils';

export default (ast) => {
  const iterAst = (tree, path) => {
    const rendered = tree.reduce((acc, treeValue) => {
      const {
        name, status, type, valueBefore, valueAfter, children,
      } = treeValue;
      const currentPath = path === '' ? `${path}${name}` : `${path}.${name}`;
      const isComplexValue = (item) => (_.isObject(item) ? '[complex value]' : `'${stringify(JSON.stringify(item))}'`);
      const renderString = (treeStatus) => {
        const newValueBefore = isComplexValue(valueBefore);
        const newValueAfter = isComplexValue(valueAfter);
        switch (treeStatus) {
          case 'changed':
            return [...acc, `Property '${currentPath}' was changed. From ${newValueBefore} to ${newValueAfter}`];
          case 'removed':
            return [...acc, `Property '${currentPath}' was deleted`];
          case 'added':
            return [...acc, `Property '${currentPath}' was added with value: ${newValueAfter}`];
          default:
            return acc;
        }
      };
      return type === 'children' ? [...acc, `${iterAst(children, currentPath)}`] : renderString(status);
    }, []);

    return `${rendered.join('\n')}`;
  };

  return iterAst(ast, '');
};
