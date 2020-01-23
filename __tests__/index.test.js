import fs from 'fs';
import genDiff from '../src';

const path = `${__dirname}/__fixtures__/`;

const expected1 = String(fs.readFileSync(`${path}expected1`));
const expected2 = String(fs.readFileSync(`${path}expected2`));
const expected3 = String(fs.readFileSync(`${path}expected3`));
const expected4 = String(fs.readFileSync(`${path}expected4`));

test('genDiff JSON', () => {
  expect(genDiff(`${path}json1`, `${path}json2`)).toBe(expected1);
  expect(genDiff(`${path}json3`, `${path}json4`)).toBe(expected2);
  expect(genDiff(`${path}json5`, `${path}json6`)).toBe(expected3);
  expect(genDiff(`${path}json7`, `${path}json8`)).toBe(expected4);
});

test('genDiff YAML', () => {
  expect(genDiff(`${path}yaml1.yml`, `${path}yaml2.yml`)).toBe(expected1);
  expect(genDiff(`${path}yaml3.yml`, `${path}yaml4.yml`)).toBe(expected2);
  expect(genDiff(`${path}yaml5.yml`, `${path}yaml6.yml`)).toBe(expected3);
  expect(genDiff(`${path}yaml7.yml`, `${path}yaml8.yml`)).toBe(expected4);
});
