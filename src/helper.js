const validateUrl = (input) => {
  let valid = true;
  if (!input.match(/^https:\/\/sqs\.([0-9A-Za-z-]+)\.amazonaws\.com\/(.+)?/)) {
    valid = 'Please enter a valid AWS SQS url!';
  }
  return valid;
};

module.exports = {
  validateUrl,
};
