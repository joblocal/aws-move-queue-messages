#!/usr/bin/env node

const aws = require('aws-sdk');
const program = require('commander');
const { prompt } = require('inquirer');
const { validateUrl } = require('./helper');
const { handle } = require('./main');
const { createClient } = require('./sqs');

const regionQuestion = {
  type: 'input',
  name: 'awsRegion',
  message: 'Enter your AWS region:',
  default: 'eu-west-1',
};

const fromQuestion = {
  type: 'input',
  name: 'sourceQueueUrl',
  message: 'Enter your source queue url:',
  validate: validateUrl,
};

const toQuestion = {
  type: 'input',
  name: 'targetQueueUrl',
  message: 'Enter your target queue url:',
  validate: validateUrl,
};

const handleAction = (from, to, options) => {
  const questions = [];

  if (!options.region) {
    questions.push(regionQuestion);
  }

  if (!from) {
    questions.push(fromQuestion);
  }

  if (!to) {
    questions.push(toQuestion);
  }

  prompt(questions).then(async ({
    awsRegion = options.region,
    sourceQueueUrl = from,
    targetQueueUrl = to,
  }) => {
    aws.config.update({ region: awsRegion });

    const sqs = createClient(new aws.SQS());
    let count;

    try {
      count = await handle({
        sourceQueueUrl,
        targetQueueUrl,
        sqs,
        prompt,
        skipPrompt: options.yes,
      });
    } catch (e) {
      console.error(`! ${e.message}`);
      process.exit(1);
    }

    console.log(`${count} messages moved from ${sourceQueueUrl} to ${targetQueueUrl}!`);
  });
};

program
  .arguments('[from] [to]')
  .option('-r, --region [value]', 'The AWS region')
  .option('-y, --yes', 'Non interactive message moving')
  .action(handleAction)
  .parse(process.argv);
