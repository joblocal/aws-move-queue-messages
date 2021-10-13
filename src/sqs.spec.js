/**
 * @jest-environment node
 */

const { createClient } = require('./sqs');

const mockCallbackFunction = (error, data) => (
  (options, callback) => {
    callback(error, data);
  }
);

describe('getCount', () => {
  test('to resolve promise', async () => {
    const sqs = createClient({
      getQueueAttributes: mockCallbackFunction(
        null,
        { Attributes: { ApproximateNumberOfMessages: 3 } },
      ),
    });

    const count = await sqs.getCount('https://sqs.region.amazonaws.com/123456789/queue');
    expect(count).toEqual(3);
  });

  test('to reject promise', () => {
    const sqs = createClient({
      getQueueAttributes: mockCallbackFunction({ message: 'error' }, null),
    });

    expect(sqs.getCount('https://sqs.region.amazonaws.com/123456789/queue')).rejects.toEqual({ message: 'error' });
  });

  test('to pass queue url', async () => {
    const mockSqs = {
      getQueueAttributes: mockCallbackFunction(
        null,
        { Attributes: { ApproximateNumberOfMessages: 3 } },
      ),
    };
    jest.spyOn(mockSqs, 'getQueueAttributes');

    const sqs = createClient(mockSqs);

    await sqs.getCount('https://sqs.region.amazonaws.com/123456789/queue');
    expect(mockSqs.getQueueAttributes).toHaveBeenCalledWith(
      {
        QueueUrl: 'https://sqs.region.amazonaws.com/123456789/queue',
        AttributeNames: [
          'ApproximateNumberOfMessages',
        ],
      },
      expect.any(Function),
    );
  });
});

describe('moveMessage', () => {
  test('to resolve promise', async () => {
    const sqs = createClient({
      receiveMessage: mockCallbackFunction(null, {
        Messages: [
          {
            Body: 'Body',
            ReceiptHandle: 'ReceiptHandle',
          },
        ],
      }),
      sendMessage: mockCallbackFunction(null, {}),
      deleteMessage: mockCallbackFunction(null, {}),
    });

    const handle = await sqs.moveMessage(
      'https://sqs.region.amazonaws.com/123456789/srcQueue',
      'https://sqs.region.amazonaws.com/123456789/targetQueue',
      false,
    );
    expect(handle).toEqual('ReceiptHandle');
  });

  test('to resolve promise - copy', async () => {
    const sqs = createClient({
      receiveMessage: mockCallbackFunction(null, {
        Messages: [
          {
            Body: 'Body',
            ReceiptHandle: 'ReceiptHandle',
          },
        ],
      }),
      sendMessage: mockCallbackFunction(null, {}),
    });

    const handle = await sqs.moveMessage(
      'https://sqs.region.amazonaws.com/123456789/srcQueue',
      'https://sqs.region.amazonaws.com/123456789/targetQueue',
      true,
    );
    expect(handle).toEqual('ReceiptHandle');
  });

  test('to reject promise', () => {
    const sqs = createClient({
      receiveMessage: mockCallbackFunction({ message: 'error' }, null),
      sendMessage: mockCallbackFunction(null, {}),
      deleteMessage: mockCallbackFunction(null, {}),
    });

    expect(sqs.moveMessage(
      'https://sqs.region.amazonaws.com/123456789/srcQueue',
      'https://sqs.region.amazonaws.com/123456789/targetQueue',
      false,
    )).rejects.toEqual({ message: 'error' });
  });

  test('to call receiveMessage with expected parameters', async () => {
    const mockSqs = {
      receiveMessage: mockCallbackFunction(null, {
        Messages: [
          {
            Body: 'Body',
            ReceiptHandle: 'ReceiptHandle',
          },
        ],
      }),
      sendMessage: mockCallbackFunction(null, {}),
      deleteMessage: mockCallbackFunction(null, {}),
    };
    jest.spyOn(mockSqs, 'receiveMessage');

    const sqs = createClient(mockSqs);

    await sqs.moveMessage(
      'https://sqs.region.amazonaws.com/123456789/srcQueue',
      'https://sqs.region.amazonaws.com/123456789/targetQueue',
      false,
    );
    expect(mockSqs.receiveMessage).toHaveBeenCalledWith(
      { QueueUrl: 'https://sqs.region.amazonaws.com/123456789/srcQueue' },
      expect.any(Function),
    );
  });

  test('to call sendMessage with expected parameters', async () => {
    const mockSqs = {
      receiveMessage: mockCallbackFunction(null, {
        Messages: [
          {
            Body: 'Body',
            ReceiptHandle: 'ReceiptHandle',
          },
        ],
      }),
      sendMessage: mockCallbackFunction(null, {}),
      deleteMessage: mockCallbackFunction(null, {}),
    };
    jest.spyOn(mockSqs, 'sendMessage');

    const sqs = createClient(mockSqs);

    await sqs.moveMessage(
      'https://sqs.region.amazonaws.com/123456789/srcQueue',
      'https://sqs.region.amazonaws.com/123456789/targetQueue',
      false,
    );
    expect(mockSqs.sendMessage).toHaveBeenCalledWith(
      {
        MessageBody: 'Body',
        QueueUrl: 'https://sqs.region.amazonaws.com/123456789/targetQueue',
      },
      expect.any(Function),
    );
  });

  test('to call deleteMessage with expected parameters', async () => {
    const mockSqs = {
      receiveMessage: mockCallbackFunction(null, {
        Messages: [
          {
            Body: 'Body',
            ReceiptHandle: 'ReceiptHandle',
          },
        ],
      }),
      sendMessage: mockCallbackFunction(null, {}),
      deleteMessage: mockCallbackFunction(null, {}),
    };
    jest.spyOn(mockSqs, 'deleteMessage');

    const sqs = createClient(mockSqs);

    await sqs.moveMessage(
      'https://sqs.region.amazonaws.com/123456789/srcQueue',
      'https://sqs.region.amazonaws.com/123456789/targetQueue',
      false,
    );
    expect(mockSqs.deleteMessage).toHaveBeenCalledWith(
      {
        ReceiptHandle: 'ReceiptHandle',
        QueueUrl: 'https://sqs.region.amazonaws.com/123456789/srcQueue',
      },
      expect.any(Function),
    );
  });
});
