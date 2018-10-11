/**
 * @jest-environment node
 */

const { validateUrl } = require('./helper');

describe('validateUrl', () => {
  test('to pass invalid url', () => {
    const validate = validateUrl('https://domain.com');
    expect(validate).toEqual('Please enter a valid AWS SQS url!');
  });

  test('to pass an empty value', () => {
    const validate = validateUrl('');
    expect(validate).toEqual('Please enter a valid AWS SQS url!');
  });

  test('to pass valid url', () => {
    const validate = validateUrl('https://sqs.region.amazonaws.com/123456789/queue');
    expect(validate).toBe(true);
  });
});
