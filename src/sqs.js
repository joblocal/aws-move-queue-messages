const createClient = (sqs) => {
  const sendMessage = (QueueUrl, MessageBody) => new Promise((resolve, reject) => {
    sqs.sendMessage(
      { QueueUrl, MessageBody },
      (error, data) => (error ? reject(error) : resolve(data)),
    );
  });

  const receiveMessage = QueueUrl => new Promise((resolve, reject) => {
    sqs.receiveMessage(
      { QueueUrl },
      (error, data) => (error ? reject(error) : resolve(data.Messages[0])),
    );
  });

  const deleteMessage = (QueueUrl, ReceiptHandle) => new Promise((resolve, reject) => {
    sqs.deleteMessage(
      { QueueUrl, ReceiptHandle },
      (error, data) => (error ? reject(error) : resolve(data)),
    );
  });

  const getCount = QueueUrl => new Promise((resolve, reject) => {
    sqs.getQueueAttributes(
      {
        QueueUrl,
        AttributeNames: [
          'ApproximateNumberOfMessages',
        ],
      },
      (error, data) => (
        error
          ? reject(error)
          : resolve(data.Attributes.ApproximateNumberOfMessages)
      ),
    );
  });

  const moveMessage = (sourceQueueUrl, targetQueueUrl, copy) => (
    new Promise(async (resolve, reject) => {
      try {
        const receivedMessage = await receiveMessage(sourceQueueUrl);

        if (!receivedMessage.Body || !receivedMessage.ReceiptHandle) {
          throw 'Queue is empty'; // eslint-disable-line
        }

        const { Body, ReceiptHandle } = receivedMessage;

        await sendMessage(targetQueueUrl, Body);
        if (!copy) {
          await deleteMessage(sourceQueueUrl, ReceiptHandle);
        }

        resolve(ReceiptHandle);
      } catch (error) {
        reject(error);
      }
    })
  );

  return {
    getCount,
    moveMessage,
  };
};

module.exports = {
  createClient,
};
