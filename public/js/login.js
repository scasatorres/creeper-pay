// Elements
const $loginForm = document.querySelector('#login-form');
const $emailFormInput = $loginForm.querySelector('#email');
const $passwordFormInput = $loginForm.querySelector('#password');
const $loginButton = $loginForm.querySelector('#login-button');

let submitted = false;
const validationInputs = [
  $emailFormInput,
  $passwordFormInput
];

$loginButton.setAttribute('disabled', 'disabled');

const isFormValid = () => {
  return $loginForm.checkValidity();
};

const toggleValidationStyles = ($element, isValid) => {
  if (!isValid) {
    $element.classList.remove('valid');
    $element.classList.add('invalid');
  } else {
    $element.classList.remove('invalid');
    $element.classList.add('valid');
  }
}

const onInputChange = (e) => {
  const valid = isFormValid();

  if (!submitted) {
    const $element = e.target;
    toggleValidationStyles($element, $element.checkValidity());
  } else {
    validationInputs.forEach(($input) => toggleValidationStyles($input, $input.checkValidity()));
  }

  if (!valid) {
    return $loginButton.setAttribute('disabled', 'disabled');
  }

  $loginButton.removeAttribute('disabled');
};

const onSubmit = async (e) => {
  e.preventDefault();

  const email = $emailFormInput.value;
  const password = $passwordFormInput.value;

  try {
    const response = await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    validationInputs.forEach(($input) => toggleValidationStyles($input, false));

    M.toast({ html: 'Invalid credentials!', classes: 'red' });
  } finally {
    submitted = true;
  }
};

// Listeners
$emailFormInput.addEventListener('input', onInputChange.bind(this));
$passwordFormInput.addEventListener('input', onInputChange.bind(this));
$loginForm.addEventListener('submit', onSubmit.bind(this));