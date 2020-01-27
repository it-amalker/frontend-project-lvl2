#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';


program
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0', '-V, --version', 'output the version number')
  .option('-f, --format <type>', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const { format = 'default' } = program;
    const outputFormats = ['json', 'plain'];
    const isCorrectFormat = outputFormats.includes(format.toLowerCase());
    if (!isCorrectFormat) {
      console.error(`incorrect format type, use [${outputFormats.join(', ')}]`);
      console.log('program will be proceed with default renderer output');
    }
    console.log(genDiff(firstConfig, secondConfig, format));
  });

program.parse(process.argv);
