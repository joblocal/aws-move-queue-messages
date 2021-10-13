/**
 * @jest-environment node
 */

const { validateUrl, validateMaxMessages } = require('./helper');

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

describe('validateMaxMessages', () => {
  test('to pass an invalid value with numeric and alpha chars', () => {
    const validate = validateMaxMessages('1abc');
    expect(validate).toEqual('Please enter a valid max number of messages greater than 0!');
  });

  test('to pass an invalid value with only alpha chars', () => {
    const validate = validateMaxMessages('abc');
    expect(validate).toEqual('Please enter a valid max number of messages greater than 0!');
  });

  test('to pass an empty value', () => {
    const validate = validateMaxMessages('');
    expect(validate).toEqual('Please enter a valid max number of messages greater than 0!');
  });

  test('to pass negative number', () => {
    const validate = validateMaxMessages('-1');
    expect(validate).toEqual('Please enter a valid max number of messages greater than 0!');
  });

  test('to pass valid number', () => {
    const validate = validateMaxMessages('10');
    expect(validate).toBe(true);
  });
});
