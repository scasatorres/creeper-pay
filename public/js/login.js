// Elements
const $loginForm = document.querySelector('#login-form');
const $emailFormInput = $loginForm.elements['email'];
const $passwordFormInput = $loginForm.elements['password'];
const $loginButton = $loginForm.elements['submit-button'];

const $emailHelperText = $loginForm.querySelector('#email-helper-text');
const $passwordHelperText = $loginForm.querySelector('#password-helper-text');

let submitted = false;
const validationInputs = [
  $emailFormInput,
  $passwordFormInput
];

$loginButton.setAttribute('disabled', 'disabled');

const onSubmit = async (e) => {
  e.preventDefault();

  const email = $emailFormInput.value;
  const password = $passwordFormInput.value;

  try {
    showLoader();

    const firebaseResponse = await firebase.auth().signInWithEmailAndPassword(email, password);
    await httpClient.post('/users/login', { uid: firebaseResponse.user.uid });

    window.location.pathname = `${baseViewsUrl}/users/account`;
  } catch (error) {
    hideLoader();

    validationInputs.forEach(($input) => toggleValidationStyles($input, false));

    M.toast({ html: 'Invalid credentials!', classes: 'red' });
  } finally {
    submitted = true;
  }
};

// Listeners
$emailFormInput.addEventListener('input', onInputChange.bind(this, submitted, (errorMessage) => {
  $emailHelperText.setAttribute('data-error', errorMessage);
}));
$passwordFormInput.addEventListener('input', onInputChange.bind(this, submitted, (errorMessage) => {
  $passwordHelperText.setAttribute('data-error', errorMessage);
}));
$loginForm.addEventListener('submit', onSubmit.bind(this));