import _ from 'lodash';
import parse from './parsers';

const diff = (arg1, arg2) => {
  const obj1 = _.isEmpty(arg1) ? {} : arg1;
  const obj2 = _.isEmpty(arg2) ? {} : arg2;

  const allKeys = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const result = allKeys.sort().reduce((acc, key) => {
    const isKeyInObj1 = _.has(obj1, key);
    const isKeyInObj2 = _.has(obj2, key);
    const ast = {
      type: '',
      name: key,
      value: '',
      valuePrev: '',
      children: [],
      status: '',
    };
    if (isKeyInObj1 && isKeyInObj2) {
      if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
        ast.status = 'unchanged';
        ast.type = 'children';
      } else {
        ast.value = obj1[key];
        ast.valuePrev = obj2[key];
        ast.status = ast.value === ast.valuePrev ? 'unchanged' : 'changed';
      }
    }
    if (isKeyInObj1 && !isKeyInObj2) {
      ast.value = obj1[key];
      ast.status = 'removed';
    }
    if (!isKeyInObj1 && isKeyInObj2) {
      ast.valuePrev = obj2[key];
      ast.status = 'added';
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    if (ast.type === 'children') {
      const child1 = obj1[key];
      const child2 = obj2[key];
      acc[key].push({ ...ast, children: diff(child1, child2) });
    } else {
      acc[key].push(ast);
    }
    return acc;
  }, {});

  return result;
};

const render = (ast) => {
  const iter = (tree, depth) => {
    const currentDepth = depth + 1;
    const res = Object.entries(tree).reduce((acc, [key, value]) => {
      const mapStatus = {
        unchanged: ' '.repeat(4 * currentDepth),
        removed: `${' '.repeat(currentDepth === 1 ? 2 : 3 * currentDepth + currentDepth - 2)}- `,
        added: `${' '.repeat(currentDepth === 1 ? 2 : 3 * currentDepth + currentDepth - 2)}+ `,
        changed: (sign) => `${' '.repeat(currentDepth === 1 ? 2 : 3 * currentDepth + currentDepth - 2)}${sign} `,
      };
      const nameAst = key;
      const valueAst = JSON.stringify(value[0].value || value[0].valuePrev);
      const statusAst = value[0].status;
      const stringify = (str) => (typeof str === 'string' ? str.replace(/"+/g, '') : str);
      const formatObj = (item) => {
        const jsonItem = JSON.parse(item);
        if (jsonItem instanceof Object) {
          const itemKey = Object.keys(jsonItem);
          return `{\n${' '.repeat(4 * (currentDepth + 1))}${itemKey}: ${stringify(jsonItem[itemKey])}\n${' '.repeat(4 * currentDepth)}}`;
        }
        return stringify(item);
      };
      if (value[0].type === 'children') {
        return [...acc, `${mapStatus[statusAst]}${nameAst}: {\n${iter(value[0].children, currentDepth)}\n${' '.repeat(4 * currentDepth)}}`];
      }
      if (statusAst === 'changed') {
        return [...acc, `${mapStatus[statusAst]('+')}${nameAst}: ${formatObj(JSON.stringify(value[0].valuePrev))}`, `${mapStatus[statusAst]('-')}${nameAst}: ${formatObj(JSON.stringify(value[0].value))}`];
      }
      return [...acc, `${mapStatus[statusAst]}${nameAst}: ${formatObj(valueAst)}`];
    }, []);
    return `${res.join('\n')}`;
  };

  return `{\n${iter(ast, 0)}\n}`;
};

export default (pathToFile1, pathToFile2) => {
  const object1 = parse(pathToFile1);
  const object2 = parse(pathToFile2);

  return render(diff(object1, object2));
};
