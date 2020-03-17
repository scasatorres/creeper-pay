const baseApiUrl = '/api/v1';
const baseViewsUrl = '/views';

// Elements
const $loader = document.querySelector('#loader-wrapper');
const $content = document.querySelector('#content');

document.addEventListener('DOMContentLoaded', () => {
  // Sidenav instances
  const sidenavs = document.querySelectorAll('.sidenav');
  const sidenavsInstances = M.Sidenav.init(sidenavs);

  const modals = document.querySelectorAll('.modal');
  const modalsInstances = M.Modal.init(modals, { dismissible: false });

  hideLoader();
});

const showLoader = () => {
  $loader.classList.remove('hide');
  $content.classList.add('hide');
};

const hideLoader = () => {
  $loader.classList.add('hide');
  $content.classList.remove('hide');
};

const httpClient = axios.create();
httpClient.defaults.baseURL = baseApiUrl;