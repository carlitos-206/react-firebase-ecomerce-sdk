import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../db';

export default function SignInAccount(userEmail, userPassword) {
  let validatedUser = false;
  async function fetchUserAccount() {
    const citiesRef = collection(db, 'userAccounts');
    const q = query(citiesRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc.data().password === userPassword) {
        console.log('User account found');
        validatedUser = true;
      } else {
        console.log('User account not found');
      }
    });
  }
  fetchUserAccount();
  return validatedUser;
}
