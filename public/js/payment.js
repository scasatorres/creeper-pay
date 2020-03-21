// Elements
const $paymentForm = document.querySelector('#payment-form');
const $payButton = $paymentForm.elements['submit-button'];

$payButton.setAttribute('disabled', 'disabled');

const findLabel = (field) => {
  return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
}

const findIcon = (field) => {
  return document.querySelector('#' + field.container.id + '-icon');
}

const findHelperText = (field) => {
  return document.querySelector('#' + field.container.id + '-helper-text');
}

const onFocus = (event) => {
  const field = event.fields[event.emittedBy];
  const label = findLabel(field);
  const icon = findIcon(field);

  field.container.classList.remove('invalid');

  label.classList.add('label-float');
  label.classList.remove('filled');

  icon.classList.add('active');
}

const onBlur = (event) => {
  const field = event.fields[event.emittedBy];
  const label = findLabel(field);
  const icon = findIcon(field);
  const helperText = findHelperText(field);

  if (field.isEmpty) {
    field.container.classList.add('invalid');

    label.classList.remove('label-float');
  } else if (field.isValid) {
    label.classList.add('filled');

    helperText.classList.remove('invalid');
    helperText.classList.add('invisible');
  } else {
    field.container.classList.add('invalid');

    helperText.classList.add('invalid');
    helperText.classList.remove('invisible');
  }

  icon.classList.remove('active');
};

const onEmptyField = (event) => {
  const field = event.fields[event.emittedBy];
  const label = findLabel(field);
  const helperText = findHelperText(field);

  label.classList.remove('filled');
  label.classList.remove('invalid');

  helperText.classList.add('invalid');
  helperText.classList.remove('invisible');
};

const onValidityChange = (event) => {
  const field = event.fields[event.emittedBy];
  const label = findLabel(field);
  const helperText = findHelperText(field);

  if (field.isPotentiallyValid) {
    label.classList.remove('invalid');
    helperText.classList.remove('invalid');
    helperText.classList.add('invisible');
  } else {
    label.classList.add('invalid');
    helperText.classList.add('invalid');
    helperText.classList.remove('invisible');
  }
};

const onSubmit = async (hostedFieldsInstance, event) => {
  event.preventDefault();

  try {
    showLoader();

    const payload = await hostedFieldsInstance.tokenize();
    await httpClient.post('payments/checkout', { paymentToken: payload.nonce });

    M.toast({
      html: 'Payment success!', classes: 'green', completeCallback: () => {
        window.location.pathname = routes.account;
      }
    });
  } catch (error) {
    M.toast({ html: error, classes: 'red' });
  }
};

const createHostedFieldsInstance = (clientInstance) => {
  return braintree.hostedFields.create({
    client: clientInstance,
    styles: {
      input: {
        'font-size': '16px',
      }
    },
    fields: {
      number: {
        selector: '#card-number',
        placeholder: '1111 1111 1111 1111'
      },
      expirationDate: {
        selector: '#expiration-date',
        placeholder: 'MM/YY'
      },
      cvv: {
        selector: '#cvv',
        placeholder: '***'
      },
    }
  });
};

const cardTokenization = (hostedFieldsInstance) => {
  hostedFieldsInstance.on('focus', onFocus.bind(this));
  hostedFieldsInstance.on('blur', onBlur.bind(this));
  hostedFieldsInstance.on('empty', onEmptyField.bind(this));
  hostedFieldsInstance.on('validityChange', onValidityChange.bind(this));

  $payButton.removeAttribute('disabled');

  $paymentForm.addEventListener('submit', onSubmit.bind(this, hostedFieldsInstance));
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    showLoader();

    const { data } = await httpClient.get('/payments/token');

    const clientInstance = await braintree.client.create({ authorization: data.clientToken });
    const hostedFieldsInstance = await createHostedFieldsInstance(clientInstance);
    await cardTokenization(hostedFieldsInstance);
  } catch (error) {
    M.toast({ html: error, classes: 'red' });
  } finally {
    hideLoader();
  }
});
