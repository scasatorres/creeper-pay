// Elements
const $signupForm = document.querySelector('#signup-form');
const $usernameFormInput = $signupForm.elements['username'];
const $emailFormInput = $signupForm.elements['email'];
const $passwordFormInput = $signupForm.elements['password'];
const $signupButton = $signupForm.elements['submit-button'];

const $usernameHelperText = $signupForm.querySelector('#username-helper-text');
const $emailHelperText = $signupForm.querySelector('#email-helper-text');
const $passwordHelperText = $signupForm.querySelector('#password-helper-text');

let submitted = false;
const validationInputs = [
  $usernameFormInput,
  $emailFormInput,
  $passwordFormInput
];

$signupButton.setAttribute('disabled', 'disabled');

const onSubmit = async (e) => {
  e.preventDefault();

  const username = $usernameFormInput.value;
  const email = $emailFormInput.value;
  const password = $passwordFormInput.value;

  try {
    const response = await axios.post(`${baseApiUrl}/users`, { username, email, password });

  } catch (error) {
    validationInputs.forEach(($input) => toggleValidationStyles($input, false));
  } finally {
    submitted = true;
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
$signupForm.addEventListener('submit', onSubmit.bind(this));