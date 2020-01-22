#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0', '-V, --version', 'output the version number')
  .option('-f, --format <type>', 'Output format')
  .action(() => {
    const { format } = program;
    const outputFormats = ['json', 'plain'];
    const isCorrectFormat = outputFormats.includes(format.toLowerCase());
    if (!isCorrectFormat) {
      console.error(`incorrect format type, use [${outputFormats.join(', ')}]`);
      process.exit(1);
    }
  })
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(genDiff(firstConfig, secondConfig));
  });

program.parse(process.argv);
