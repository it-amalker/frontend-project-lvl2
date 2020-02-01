import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe.only.each`
  format    | pathToFile1      | pathToFile2
  ${'JSON'} | ${'before.json'} | ${'after.json'}
  ${'YAML'} | ${'before.yml'}  | ${'after.yml'}
  ${'INI'}  | ${'before.ini'}  | ${'after.ini'}
`('TESTS', ({
  format, pathToFile1, pathToFile2,
}) => {
  const before = getFixturePath(pathToFile1);
  const after = getFixturePath(pathToFile2);

  const isIniFormat = () => (format === 'INI' ? '-ini' : '');
  const defaultOutput = readFile(`result${isIniFormat()}`);
  const plainOutput = readFile(`result${isIniFormat()}-plain`);
  const jsonOutput = readFile(`result${isIniFormat()}.json`);

  test(`${format} (default)`, () => {
    expect(genDiff(before, after)).toBe(defaultOutput);
  });

  test(`${format} (plain)`, () => {
    expect(genDiff(before, after, 'plain')).toBe(plainOutput);
  });

  test(`${format} (json)`, () => {
    expect(genDiff(before, after, 'json')).toBe(jsonOutput);
  });
});
