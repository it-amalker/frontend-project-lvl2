import { isObject, stringify } from '../utils';

export default (ast) => {
  const iterAst = (tree, path) => {
    const rendered = Object.values(tree).reduce((acc, treeValue) => {
      const {
        name, status, type, value, valuePrev, children,
      } = treeValue[0];
      const currentPath = path === '' ? `${path}${name}` : `${path}.${name}`;
      const isComplexValue = (item) => (isObject(item) ? '[complex value]' : `'${stringify(JSON.stringify(item))}'`);
      const renderString = (treeStatus) => {
        const newValue = isComplexValue(value);
        const newValuePrev = isComplexValue(valuePrev);
        switch (treeStatus) {
          case 'changed':
            return [...acc, `Property '${currentPath}' was changed. From ${newValue} to ${newValuePrev}`];
          case 'removed':
            return [...acc, `Property '${currentPath}' was deleted`];
          case 'added':
            return [...acc, `Property '${currentPath}' was added with value: ${newValuePrev}`];
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
