import fs from 'fs';
import getDiff from '../src';

const path = `${__dirname}/__fixtures__/`;

const expected1 = String(fs.readFileSync(`${path}expectedString1`));
const expected2 = String(fs.readFileSync(`${path}expectedString2`));
const expected3 = String(fs.readFileSync(`${path}expectedString3`));
const expected4 = String(fs.readFileSync(`${path}expectedString4`));

test('getDiff', () => {
  expect(getDiff(`${path}json1`, `${path}json2`)).toBe(expected1);
  expect(getDiff(`${path}json3`, `${path}json4`)).toBe(expected2);
  expect(getDiff(`${path}json5`, `${path}json6`)).toBe(expected3);
  expect(getDiff(`${path}json7`, `${path}json8`)).toBe(expected4);
});
