import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH,
  ),
});

const db = admin.firestore();

export { db };
