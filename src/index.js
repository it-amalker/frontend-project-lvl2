import _ from 'lodash';
import parse from './parsers';

const diff = (object1, object2) => {
  const commonKeys = _.uniq(Object.keys(object1).concat(Object.keys(object2)));

  const result = commonKeys.sort().reduce((acc, key) => {
    const value1 = object1[key];
    const value2 = object2[key];
    const buildAstNode = (obj1, obj2) => {
      const node = {
        type: '',
        name: key,
        value: '',
        valuePrev: '',
        children: [],
        status: '',
      };
      const compareArray = (arr1, arr2) => arr1.every((el) => arr2.includes(el));
      const isObjects = (...items) => items.every((obj) => obj instanceof Object);
      const isArrays = (...items) => items.every((arr) => Array.isArray(arr));
      const isKeyInObj1 = _.has(obj1, key);
      const isKeyInObj2 = _.has(obj2, key);

      if (isKeyInObj1 && isKeyInObj2) {
        if (isObjects(value1, value2) && !isArrays(value1, value2)) {
          node.status = 'unchanged';
          node.type = 'children';
        } else {
          node.value = value1;
          node.valuePrev = value2;
          if (isArrays(value1, value2)) {
            node.status = compareArray(value1, value2) ? 'unchanged' : 'changed';
          } else {
            node.status = node.value === node.valuePrev ? 'unchanged' : 'changed';
          }
        }
      }
      if (isKeyInObj1 && !isKeyInObj2) {
        node.value = value1;
        node.status = 'removed';
      }
      if (!isKeyInObj1 && isKeyInObj2) {
        node.valuePrev = value2;
        node.status = 'added';
      }
      return node;
    };

    const astNode = buildAstNode(object1, object2);

    if (!acc[key]) {
      acc[key] = [];
    }
    if (astNode.type === 'children') {
      const child1 = value1;
      const child2 = value2;
      acc[key].push({ ...astNode, children: diff(child1, child2) });
    } else {
      acc[key].push(astNode);
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
      const stringify = (str) => (typeof str === 'string' ? str.replace(/(^")|("$)/g, '') : str);
      const formatObj = (item) => {
        const jsonItem = JSON.parse(item);
        if (Array.isArray(jsonItem)) {
          const allItems = jsonItem.map((itemKey) => `${' '.repeat(4 * (currentDepth + 1))}${itemKey}`);
          return `[\n${allItems.join('\n')}\n${' '.repeat(4 * currentDepth)}]`;
        }
        if (jsonItem instanceof Object) {
          const itemKeys = Object.keys(jsonItem);
          const allItems = itemKeys.map((itemKey) => `${' '.repeat(4 * (currentDepth + 1))}${itemKey}: ${stringify(jsonItem[itemKey])}`);
          return `{\n${allItems.join('\n')}\n${' '.repeat(4 * currentDepth)}}`;
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
