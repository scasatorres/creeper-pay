const baseApiUrl = '/api/v1';
const baseViewsUrl = '/views';

// Elements
const $logoutLink = document.querySelector('#logout-link');
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

// Listeners
if ($logoutLink) {
  $logoutLink.addEventListener('click', async () => {
    try {
      showLoader();
      await httpClient.post('/users/logout');

      window.location = '/';
    } catch (error) {
      hideLoader();

      M.toast({ html: error, classes: 'red' });
    }
  });
}

const httpClient = axios.create();
httpClient.defaults.baseURL = baseApiUrl;