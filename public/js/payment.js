// Elements
const $paymentForm = document.querySelector('#payment-form');
const $cardNumberInput = $paymentForm.elements['card-number'];
const $expirationDateInput = $paymentForm.elements['expiration-date'];
const $cvvInput = $paymentForm.elements['cvv'];
const $payButton = $paymentForm.elements['submit-button'];

const $cardNumberHelperText = $paymentForm.querySelector('#card-number-helper-text');
const $expirationDateHelperText = $paymentForm.querySelector('#expiration-date-helper-text');
const $cvvHelperText = $paymentForm.querySelector('#cvv-helper-text');

let submitted = false;
const validationInputs = [
  $cardNumberInput,
  $expirationDateInput,
  $cvvInput
];

$payButton.setAttribute('disabled', 'disabled');

const findLabel = (field) => {
  return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
}

const findIcon = (field) => {
  return document.querySelector('#' + field.container.id + '-icon');
}

const options = {
  authorization: 'sandbox_csndb7c4_b8wnzm35pz65w4zp'
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
        placeholder: '1111 1111 1111 1111',
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
  hostedFieldsInstance.on('focus', function (event) {
    const field = event.fields[event.emittedBy];

    field.container.classList.remove('invalid');
    findLabel(field).classList.add('label-float');
    findLabel(field).classList.remove('filled');
    findIcon(field).classList.add('active');
  });

  hostedFieldsInstance.on('blur', function (event) {
    const field = event.fields[event.emittedBy];
    const label = findLabel(field);

    if (field.isEmpty) {
      field.container.classList.add('invalid');
      label.classList.remove('label-float');
    } else if (field.isValid) {
      label.classList.add('filled');
    } else {
      // label.classList.add('invalid');
      field.container.classList.add('invalid');
    }

    findIcon(field).classList.remove('active');
  });

  hostedFieldsInstance.on('empty', function (event) {
    const field = event.fields[event.emittedBy];

    findLabel(field).classList.remove('filled');
    findLabel(field).classList.remove('invalid');
  });

  hostedFieldsInstance.on('validityChange', function (event) {
    const field = event.fields[event.emittedBy];
    const label = findLabel(field);

    if (field.isPotentiallyValid) {
      label.classList.remove('invalid');
    } else {
      label.classList.add('invalid');
    }
  });

  $payButton.removeAttribute('disabled');

  $paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
      if (tokenizeErr) {
        return M.toast({ html: tokenizeErr, classes: 'red' });
      }

      // If this was a real integration, this is where you would
      // send the nonce to your server.
      console.log('Got a nonce: ' + payload.nonce);
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  showLoader();
});

braintree.client.create(options)
  .then(createHostedFieldsInstance)
  .then(cardTokenization)
  .catch((error) => {
    return M.toast({ html: tokenizeErr, classes: 'red' });
  })
  .finally(() => hideLoader());

