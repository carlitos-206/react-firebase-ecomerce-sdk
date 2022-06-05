import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

const db = getFirestore(app);

export default db;
// ensure youre rules in firebase are

// rules_version = '2';
//     service cloud.firestore {
//     match /databases/{database}/documents {
//     match /{document=**} {
//     allow read, write;
//    }
//   }
// }

// firebastore database > rules
