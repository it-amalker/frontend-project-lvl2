import fs from 'fs';
import genDiff from '../src';

const path = `${__dirname}/../__fixtures__/`;

const default1 = String(fs.readFileSync(`${path}expected1`));
const default2 = String(fs.readFileSync(`${path}expected2`));
const default3 = String(fs.readFileSync(`${path}expected3`));
const default4 = String(fs.readFileSync(`${path}expected4`));
const plain1 = String(fs.readFileSync(`${path}expected1-plain`));
const plain2 = String(fs.readFileSync(`${path}expected2-plain`));
const plain3 = String(fs.readFileSync(`${path}expected3-plain`));
const plain4 = String(fs.readFileSync(`${path}expected4-plain`));
const json1 = String(fs.readFileSync(`${path}expected1-json`));
const json2 = String(fs.readFileSync(`${path}expected2-json`));
const json3 = String(fs.readFileSync(`${path}expected3-json`));
const json4 = String(fs.readFileSync(`${path}expected4-json`));

describe.only.each`
  format       |  file1                 | file2                 | normal       | plain      |  json
  ${'JSON #1'} |  ${`${path}json1`}     | ${`${path}json2`}     | ${default1}  | ${plain1}  |  ${json1}
  ${'JSON #2'} |  ${`${path}json3`}     | ${`${path}json4`}     | ${default2}  | ${plain2}  |  ${json2}
  ${'JSON #3'} |  ${`${path}json5`}     | ${`${path}json6`}     | ${default3}  | ${plain3}  |  ${json3}
  ${'YAML #1'} |  ${`${path}yaml1.yml`} | ${`${path}yaml2.yml`} | ${default1}  | ${plain1}  |  ${json1}
  ${'YAML #2'} |  ${`${path}yaml3.yml`} | ${`${path}yaml4.yml`} | ${default2}  | ${plain2}  |  ${json2}
  ${'YAML #3'} |  ${`${path}yaml5.yml`} | ${`${path}yaml6.yml`} | ${default3}  | ${plain3}  |  ${json3}
  ${'INI #1'}  |  ${`${path}conf1.ini`} | ${`${path}conf2.ini`} | ${default4}  | ${plain4}  |  ${json4}
  ${'INI #2'}  |  ${`${path}conf3.ini`} | ${`${path}conf4.ini`} | ${default2}  | ${plain2}  |  ${json2}
  ${'INI #3'}  |  ${`${path}conf5.ini`} | ${`${path}conf6.ini`} | ${default3}  | ${plain3}  |  ${json3}
`('TESTS', ({
  format, file1, file2, normal, plain, json,
}) => {
  test(`${format} (default)`, () => {
    expect(genDiff(file1, file2)).toBe(normal);
  });

  test(`${format} (plain)`, () => {
    expect(genDiff(file1, file2, 'plain')).toBe(plain);
  });

  test(`${format} (json)`, () => {
    expect(genDiff(file1, file2, 'json')).toBe(json);
  });
});
