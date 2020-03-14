import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH,
  ),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

export { db };
