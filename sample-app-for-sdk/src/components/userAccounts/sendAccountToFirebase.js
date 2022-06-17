// Firebase
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../db';

export default function CreateAccount(userFirstName, userLastName, userEmail, userPassword) {
  const entriesRef = collection(db, 'userAccounts');
  addDoc(entriesRef, {
    email: userEmail,
    password: userPassword,
    firstName: userFirstName,
    lastName: userLastName,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  });
}
