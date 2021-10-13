const { Spinner } = require('clui');

const handle = async ({
  sourceQueueUrl,
  targetQueueUrl,
  maxMessages,
  sqs,
  prompt,
  skipPrompt,
}) => {
  const count = await sqs.getCount(sourceQueueUrl);
  await sqs.getCount(targetQueueUrl);

  if (parseInt(count, 10) === 0) {
    throw new Error(`The queue ${sourceQueueUrl} is empty!`);
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
        message: `Do you want to move ${moveCount} of ${count} messages?`,
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

  for (let i = 0; i < moveCount; i += 1) {
    promises.push(sqs.moveMessage(sourceQueueUrl, targetQueueUrl));
  }

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
