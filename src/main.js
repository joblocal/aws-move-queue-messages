const { Spinner } = require('clui');

const handle = async ({
  sourceQueueUrl,
  targetQueueUrl,
  maxMessages,
  copy,
  sqs,
  prompt,
  skipPrompt,
}) => {
  const count = await sqs.getCount(sourceQueueUrl);
  await sqs.getCount(targetQueueUrl);

  if (parseInt(count, 10) === 0) {
    throw new Error(`The queue ${sourceQueueUrl} is empty!`);
  }

  let copyOrMove = 'move';
  if (copy) {
    copyOrMove = 'copy';
  }

  const maxCount = parseInt(maxMessages, 10);
  let moveCount = count;
  if (count > maxCount) {
    moveCount = maxCount;
  }

  if (!skipPrompt) {
    const { move } = await prompt([
      {
        type: 'confirm',
        name: 'move',
        message: `Do you want to ${copyOrMove} ${moveCount} of ${count} messages?`,
        default: false,
      },
    ]);

    if (!move) {
      process.exit(0);
    }
  }

  const spinner = new Spinner(`Moving ${moveCount} messages...`);
  spinner.start();

  const promises = [];

  promises.push(sqs.moveMessage(sourceQueueUrl, targetQueueUrl, copy));
  
  await Promise.all(promises).then(() => {
    spinner.stop();
  }).catch((e) => {
    spinner.stop();
    throw new Error(e.message);
  });

  return moveCount;
};

module.exports = {
  handle,
};
