import React from 'react';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../db';

export default function AdminEditItem(docID) {
  async function callItemToEdit(id) {
    console.log(id);
    const storeItemRef = collection(db, 'storeItems');
    const q = query(storeItemRef, where('uniqueID', '==', id));
    const snapShot = await getDocs(q);
    snapShot.forEach((doc, idx) => {
      return (
        <div>
          <form>
            <label htmlFor="test">
              test
              <input type="text" name="test" placeholder={doc.data().uniqueID} />
            </label>
          </form>
        </div>
      );
    });
  }
  callItemToEdit(docID);
}
