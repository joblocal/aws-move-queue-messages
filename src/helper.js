const validateUrl = (input) => {
  let valid = true;
  if (!input.match(/^https:\/\/sqs\.([0-9A-Za-z-]+)\.amazonaws\.com\/(.+)?/)) {
    valid = 'Please enter a valid AWS SQS url!';
  }
  return valid;
};

const validateMaxMessages = (input) => {
  let valid = true;
  if (!input.match(/^[1-9][0-9]*$/)) {
    valid = 'Please enter a valid max number of messages greater than 0!'
  }

  return valid;
}

module.exports = {
  validateUrl,
  validateMaxMessages
};
