import fs from 'fs';
import genDiff from '../src';

const path = `${__dirname}/../__fixtures__/`;

const expected1 = String(fs.readFileSync(`${path}expected1`));
const expected2 = String(fs.readFileSync(`${path}expected2`));
const expected3 = String(fs.readFileSync(`${path}expected3`));
const expected4 = String(fs.readFileSync(`${path}expected4`));
const expectedPlain2 = String(fs.readFileSync(`${path}expected2-plain`));

test.each`
  a                 | b                 | expected
  ${`${path}json1`} | ${`${path}json2`} | ${expected1}
  ${`${path}json3`} | ${`${path}json4`} | ${expected2}
  ${`${path}json5`} | ${`${path}json6`} | ${expected3}
`('JSON', ({ a, b, expected }) => {
  expect(genDiff(a, b)).toBe(expected);
});

test.each`
  a                 | b                 | expected
  ${`${path}json3`} | ${`${path}json4`} | ${expectedPlain2}
`('JSON (plain output)', ({ a, b, expected }) => {
  expect(genDiff(a, b, 'plain')).toBe(expected);
});

test.each`
  a                     | b                     | expected
  ${`${path}yaml1.yml`} | ${`${path}yaml2.yml`} | ${expected1}
  ${`${path}yaml3.yml`} | ${`${path}yaml4.yml`} | ${expected2}
  ${`${path}yaml5.yml`} | ${`${path}yaml6.yml`} | ${expected3}
`('YAML', ({ a, b, expected }) => {
  expect(genDiff(a, b)).toBe(expected);
});

test.each`
  a                     | b                     | expected
  ${`${path}conf1.ini`} | ${`${path}conf2.ini`} | ${expected4}
  ${`${path}conf3.ini`} | ${`${path}conf4.ini`} | ${expected2}
  ${`${path}conf5.ini`} | ${`${path}conf6.ini`} | ${expected3}
`('INI', ({ a, b, expected }) => {
  expect(genDiff(a, b)).toBe(expected);
});
