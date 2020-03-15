document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/users/me`);
  } catch (error) {

  }
});
