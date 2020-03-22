
document.addEventListener('DOMContentLoaded', async () => {
  try {
    showLoader();

    const { data } = await httpClient.get('/payments/payment-amount');

    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,
      // Customize button (optional)
      locale: 'en_US',
      style: {
        size: 'medium',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: data.amount,
              description: 'Minecraft server monthly payment'
            }
          }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          showLoader();

          await actions.order.capture();
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
    }).render('#paypal-button');
  } catch (error) {
    M.toast({ html: error, classes: 'red' });
  }
});