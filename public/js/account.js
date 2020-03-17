// Elements
const $accountForm = document.querySelector('#account-form');
const $usernameFormInput = $accountForm.elements['username'];
const $emailFormInput = $accountForm.elements['email'];
const $passwordFormInput = $accountForm.elements['password'];
const $submitButton = $accountForm.elements['submit-button'];

const $confirmationModal = document.querySelector('#confirmation-modal');
const $confirmationModalAcceptButton = $confirmationModal.querySelector('#confirmation-modal-accept-button');
const $confirmationModalCancelButton = $confirmationModal.querySelector('#confirmation-modal-cancel-button');

const $usernameHelperText = $accountForm.querySelector('#username-helper-text');
const $emailHelperText = $accountForm.querySelector('#email-helper-text');
const $passwordHelperText = $accountForm.querySelector('#password-helper-text');

let submitted = false;
const validationInputs = [
  $usernameFormInput,
  $emailFormInput,
  $passwordFormInput
];

const onSubmit = async (e) => {
  e.preventDefault();

  const dirtyInputs = [...$accountForm.elements].filter(($el) => !!$el.getAttribute('dirty'));
  const userData = dirtyInputs.reduce((data, input) => {
    data[input.name] = input.value;
    return data;
  }, {});

  if (userData && Object.keys(userData).length) {
    try {
      showLoader();

      await httpClient.patch('/users/me', userData);

      validationInputs.forEach(($input) => {
        $input.classList.remove('valid');
        $input.removeAttribute('dirty');
      });

      M.toast({ html: 'Changes saved successfully!', classes: 'green' });
    } catch (error) {
      M.toast({ html: error, classes: 'red' });
    } finally {
      hideLoader();

      submitted = true;
    }
  }
};

// Listeners
$usernameFormInput.addEventListener('input', onInputChange.bind(this, submitted, (errorMessage) => {
  $usernameHelperText.setAttribute('data-error', errorMessage);
}));
$emailFormInput.addEventListener('input', onInputChange.bind(this, submitted, (errorMessage) => {
  $emailHelperText.setAttribute('data-error', errorMessage);
}));
$passwordFormInput.addEventListener('input', onInputChange.bind(this, submitted, (errorMessage) => {
  $passwordHelperText.setAttribute('data-error', errorMessage);
}));
$accountForm.addEventListener('submit', onSubmit.bind(this));
$confirmationModalAcceptButton.addEventListener('click', async () => {
  try {
    showLoader();
    await httpClient.delete('/users/me');

    window.location.pathname = '/';
  } catch (error) {
    hideLoader();

    M.toast({ html: error, classes: 'red' });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data } = await httpClient.get('/users/me');

    Object.keys(data).forEach((key) => {
      if ($accountForm.elements[key]) {
        $accountForm.elements[key].value = data[key]
      }
    });

    M.updateTextFields();
  } catch (error) {
    M.toast({ html: error, classes: 'red' });
  }
});
