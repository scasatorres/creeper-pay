const braintree = require('braintree');

const gateway = braintree.connect({
  environment: process.env.BRAINTREE_ENVIRONMENT,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

module.exports = gateway;