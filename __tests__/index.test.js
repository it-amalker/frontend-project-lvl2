import getDiff from '../src';

const path1 = './__tests__/json_test/json1';
const path2 = './__tests__/json_test/json2';
const path3 = './__tests__/json_test/json3';
const path4 = './__tests__/json_test/json4';

test('getDiff', () => {
  expect(getDiff(path1, path2)).toBe(`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`);
});

test('getDiff', () => {
  expect(getDiff(path3, path4)).toBe(`{
    name: John
  + age: 42
  - age: 32
  - country: USA
  + surname: Johnson
}`);
});
