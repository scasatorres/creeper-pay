
document.addEventListener('DOMContentLoaded', async () => {
  try {
    showLoader();

    const amountResponse = await httpClient.get('/payments/payment-amount');
    const fundingSourcesResponse = await httpClient.get('/payments/funding-sources');

    const { amount } = amountResponse.data;
    const { fundingSources } = fundingSourcesResponse.data;

    fundingSources.forEach(function (fundingSource) {
      const button = paypal.Buttons({
        fundingSource: paypal.FUNDING[fundingSource],
        // Customize button (optional)
        locale: 'en_US',
        style: {
          size: 'medium',
          shape: 'rect',
          label: 'pay',
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'EUR',
                value: amount,
                description: 'Minecraft server monthly payment'
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            showLoader();

            await httpClient.post('/payments/paypal-checkout', { orderID: data.orderID })
            M.toast({
              html: 'Payment success!', classes: 'green', completeCallback: () => {
                window.location.pathname = routes.account;
              }
            });
          } catch (error) {
            hideLoader();

            M.toast({ html: error, classes: 'red' });
          }
        }
      });

      if (button.isEligible()) {
        button.render('#paypal-button-container');
      }
    })
  } catch (error) {
    M.toast({ html: error, classes: 'red' });
  } finally {
    hideLoader();
  }
});