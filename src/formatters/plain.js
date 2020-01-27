import { isObject } from '../diff';

export default (ast) => {
  const iterAst = (tree, path) => {
    const rendered = Object.values(tree).reduce((acc, treeValue) => {
      const {
        name, status, type, value, valuePrev, children,
      } = treeValue[0];
      const currentPath = path === '' ? `${path}${name}` : `${path}.${name}`;
      const isComplexValue = (item) => (isObject(item) ? '[complex value]' : `'${item}'`);
      if (type === 'children') {
        return [...acc, `${iterAst(children, currentPath)}`];
      }
      if (status === 'changed') {
        return [...acc, `Property '${currentPath}' was changed. From ${isComplexValue(value)} to ${isComplexValue(valuePrev)}`];
      }
      if (status === 'removed') {
        return [...acc, `Property '${currentPath}' was deleted`];
      }
      if (status === 'added') {
        return [...acc, `Property '${currentPath}' was added with value: ${isComplexValue(valuePrev)}`];
      }
      return acc;
    }, []);

    return `${rendered.join('\n')}`;
  };

  return iterAst(ast, '');
};
