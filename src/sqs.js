const createClient = (sqs) => {
  const sendMessage = (QueueUrl, MessageBody, MessageAttributes) => new Promise((resolve, rej) => {
    sqs.sendMessage(
      { QueueUrl, MessageBody, MessageAttributes },
      (error, data) => (error ? rej(error) : resolve(data)),
    );
  });

  const receiveMessage = QueueUrl => new Promise((resolve, reject) => {
    sqs.receiveMessage(
      { QueueUrl, MessageAttributeNames: ['All'] },
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

        const { Body, ReceiptHandle, MessageAttributes } = receivedMessage;

        const deleteArrays = (obj) => {
          if (typeof obj !== 'undefined') {
            Object.keys(obj).forEach((key) => {
              if (Array.isArray(obj[key])) {
                // Remove invalid Array values in MessageAttributes
                delete obj[key]; // eslint-disable-line
              } else if (typeof obj[key] === 'object') {
                deleteArrays(obj[key]);
              }
            });
          }
        };
        deleteArrays(MessageAttributes);

        await sendMessage(targetQueueUrl, Body, MessageAttributes);
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
