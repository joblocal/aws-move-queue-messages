const aws = require('aws-sdk');
const clear = require('clear');
const { prompt } = require('inquirer');
const { validateUrl } = require('./helper');
const { handle } = require('./main');
const { createClient } = require('./sqs');

clear();

prompt([
  {
    type: 'input',
    name: 'awsRegion',
    message: 'Enter your AWS region:',
    default: 'eu-west-1',
  },
  {
    type: 'input',
    name: 'sourceQueueUrl',
    message: 'Enter your source queue url:',
    validate: validateUrl,
  },
  {
    type: 'input',
    name: 'targetQueueUrl',
    message: 'Enter your target queue url:',
    validate: validateUrl,
  },
]).then(async ({ awsRegion, sourceQueueUrl, targetQueueUrl }) => {
  aws.config.update({ region: awsRegion });

  const sqs = createClient(new aws.SQS());
  let count;

  try {
    count = await handle({
      sourceQueueUrl,
      targetQueueUrl,
      sqs,
      prompt,
    });
  } catch (e) {
    console.error(`! ${e.message}`);
    process.exit(1);
  }

  console.log(`${count} messages move from ${sourceQueueUrl} to ${targetQueueUrl}!`);
});
