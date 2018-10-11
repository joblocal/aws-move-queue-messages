/**
 * @jest-environment node
 */

const { handle } = require('./main');

describe('handle', () => {
  test('to move messages', async () => {
    const sqs = {
      getCount: jest.fn(() => 3),
      moveMessage: jest.fn(),
    };

    const prompt = jest.fn(() => ({ move: true }));

    await handle({
      sourceQueueUrl: 'https://sqs.region.amazonaws.com/123456789/srcQueue',
      targetQueueUrl: 'https://sqs.region.amazonaws.com/123456789/targetQueue',
      sqs,
      prompt,
    });

    expect(sqs.getCount).toHaveBeenCalled();
  });

  describe('reject promise', () => {
    test('on failed count', () => {
      const sqs = {
        getCount: jest.fn().mockRejectedValue({ message: 'getCount' }),
        moveMessage: jest.fn(),
      };

      const prompt = jest.fn(() => ({ move: true }));

      expect(handle({
        sourceQueueUrl: 'https://sqs.region.amazonaws.com/123456789/srcQueue',
        targetQueueUrl: 'https://sqs.region.amazonaws.com/123456789/targetQueue',
        sqs,
        prompt,
      })).rejects.toEqual({ message: 'getCount' });
    });

    test('on failed move message', () => {
      const sqs = {
        getCount: jest.fn(() => 1),
        moveMessage: jest.fn().mockRejectedValue({ message: 'moveMessage' }),
      };

      const prompt = jest.fn(() => ({ move: true }));

      expect(handle({
        sourceQueueUrl: 'https://sqs.region.amazonaws.com/123456789/srcQueue',
        targetQueueUrl: 'https://sqs.region.amazonaws.com/123456789/targetQueue',
        sqs,
        prompt,
      })).rejects.toEqual(new Error('moveMessage'));
    });

    test('on queue empty', () => {
      const sqs = {
        getCount: jest.fn(() => 0),
        moveMessage: jest.fn(),
      };

      const prompt = jest.fn(() => ({ move: true }));

      expect(handle({
        sourceQueueUrl: 'https://sqs.region.amazonaws.com/123456789/srcQueue',
        targetQueueUrl: 'https://sqs.region.amazonaws.com/123456789/targetQueue',
        sqs,
        prompt,
      })).rejects.toEqual(new Error('The queue https://sqs.region.amazonaws.com/123456789/srcQueue is empty!'));
    });
  });
});
