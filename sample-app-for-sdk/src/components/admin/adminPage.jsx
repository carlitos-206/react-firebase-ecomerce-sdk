import React, { useEffect, useState } from 'react';
import './adminPage.css';
import { Link } from 'react-router-dom';
import {
  collection,
  query,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../db';
import AdminForm from './adminForm';
import AdminStoreItems from './adminStoreItems';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(null);
  useEffect(() => {
    async function validateAdmin() {
      const adminRef = collection(db, 'adminKey');
      const q = query(adminRef);
      const querySnapShot = await getDocs(q);
      querySnapShot.forEach((doc) => {
        if (doc.data().key === adminKey) {
          document.getElementsByClassName('adminKeyIsValid')[0].setAttribute('style', 'display:block');
          document.getElementById('adminKeyField').setAttribute('style', 'display:none');
          document.getElementsByClassName('adminKeyForm')[0].setAttribute('style', 'display:none');
          document.getElementById('keyError').setAttribute('style', 'display:none');
        } else {
          document.getElementById('adminKeyField').setAttribute('style', 'display:block');
          document.getElementsByClassName('adminKeyIsValid')[0].setAttribute('style', 'display:none');
          document.getElementsByClassName('adminKeyForm')[0].setAttribute('style', 'display:block');
        }
      });
    }
    validateAdmin();
  }, [adminKey]);
  async function readText(e) {
    const file = e.target.files.item(0);
    const key = await file.text();
    setAdminKey(key);
  }
  function checkKey(e) {
    e.preventDefault();
    setAdminKey(null);
    document.getElementsByClassName('adminMainKey')[0].value = null;
    alert('Invalid Key or Select File Again');
  }
  return (
    <div className="adminPageContainer">
      <h2 id="adminToHomeLink"><Link to="/"> Return to client screen</Link> |</h2>
      <div className="adminKeyForm glow-on-hover">
        <h1>Insert Key</h1>
        <input className="adminMainKey" id="adminKeyField" type="file" onChange={(e) => { readText(e); }} />
        <button type="submit" id="keyError" onClick={(e) => { checkKey(e); }}>Unlock</button>
      </div>
      <div className="adminKeyIsValid" style={{ display: 'none' }}>
        <AdminForm />
        <AdminStoreItems />
      </div>
    </div>
  );
}
