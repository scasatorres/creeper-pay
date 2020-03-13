import braintree, { Environment } from 'braintree';

const gateway = braintree.connect({
  environment: <Environment>process.env.BRAINTREE_ENVIRONMENT,
  merchantId: `${process.env.BRAINTREE_MERCHANT_ID}`,
  publicKey: `${process.env.BRAINTREE_PUBLIC_KEY}`,
  privateKey: `${process.env.BRAINTREE_PRIVATE_KEY}`,
});

export { gateway };
