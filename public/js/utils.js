

const onInputChange = (submitted, callback, e) => {
  const $element = e.target;
  const $submitButton = $element.form.elements['submit-button'];
  const valid = $element.form.checkValidity();

  if (!submitted) {
    toggleValidationStyles($element, $element.checkValidity());
  } else {
    validationInputs.forEach(($input) => toggleValidationStyles($input, $input.checkValidity()));
  }

  if (!valid) {
    $submitButton.setAttribute('disabled', 'disabled');

    if (callback) {
      return callback($element.validationMessage);
    }

    return;
  }

  $submitButton.removeAttribute('disabled');
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