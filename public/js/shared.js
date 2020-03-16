const baseApiUrl = '/api/v1';
const baseViewsUrl = '/views';

// Elements
const $logoutLink = document.querySelector('#logout-link');

document.addEventListener('DOMContentLoaded', () => {
  // Sidenav instances
  const sidenavs = document.querySelectorAll('.sidenav');
  const sidenavsInstances = M.Sidenav.init(sidenavs);

  const modals = document.querySelectorAll('.modal');
  const modalsInstances = M.Modal.init(modals, { dismissible: false });
});

// Listeners
$logoutLink.addEventListener('click', async () => {
  try {
    await axios.post(`${baseApiUrl}/users/logout`);

    window.location = '/';
  } catch (error) {
    M.toast({ html: error, classes: 'red' });
  }
});