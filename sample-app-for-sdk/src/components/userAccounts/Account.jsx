import React, { useState, useEffect } from 'react';
// SHA 256 ---  npm install --save sha256
import sha256 from 'sha256';
import './account.css';
import Button from '@mui/material/Button';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../db';
import CreateAccount from './sendAccountToFirebase';

export default function AccountWindow() {
  const [switchForm, setSwitchForm] = useState('');
  const [isActive, setIsActive] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  function showWindow() {
    document.getElementsByClassName('accountDiv')[0].setAttribute('style', 'display:block');
  }
  function closeAccountForm(e) {
    document.getElementsByClassName('accountDiv')[0].setAttribute('style', 'display:none');
  }
  useEffect(() => {
    if (switchForm === 'signUpForm') {
      document.getElementsByClassName('signInForm')[0].setAttribute('style', 'display:none');
      document.getElementsByClassName('createAccountForm')[0].setAttribute('style', 'display:block');
    }
    if (switchForm === 'signInForm') {
      document.getElementsByClassName('createAccountForm')[0].setAttribute('style', 'display:none');
      document.getElementsByClassName('signInForm')[0].setAttribute('style', 'display:block');
    }
  }, [switchForm]);
  async function validateCreateAccountForm(e) {
    e.preventDefault();
    let validator = true;
    let email = document.forms.formToCreateAccount.elements.signUpEmail.value;
    let password = document.getElementById('passwordField').value;
    let firstName = document.forms.formToCreateAccount.elements.signUpFirstName.value;
    let lastName = document.forms.formToCreateAccount.elements.signUpLastName.value;
    const array = [];
    const emailRef = collection(db, 'userAccounts');
    const q = query(emailRef, where('email', '==', email));
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      if (doc.data().email === email) {
        alert('This Email Exist, Sign In');
        validator = false;
      }
    });
    if (validator) {
      CreateAccount(firstName, lastName, email, sha256(password));
      alert(`Welcome ${firstName}, Please Sign In`);
      closeAccountForm(e);
      setSwitchForm('signInForm');
      email = null;
      password = null;
      firstName = null;
      lastName = null;
    }
  }
  useEffect(() => {
    if (isActive === true) {
      document.getElementsByClassName('accountVerificationProcess')[0].setAttribute('style', 'display:none');
      document.getElementsByClassName('accountVerified')[0].setAttribute('style', 'display:block');
    } else {
      document.getElementsByClassName('accountVerificationProcess')[0].setAttribute('style', 'display:block');
      document.getElementsByClassName('accountVerified')[0].setAttribute('style', 'display:none');
    }
  }, [isActive, userEmail, userFirstName]);
  async function queryAccount(email, hashedPassword) {
    let validatedUser = false;
    const citiesRef = collection(db, 'userAccounts');
    const q = query(citiesRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc.data().password === hashedPassword) {
        validatedUser = true;
      }
      if (validatedUser) {
        setIsActive(true);
        setUserEmail(email);
        setUserFirstName(doc.data().firstName);
      } else {
        alert('Invalid');
      }
    });
  }
  function validateSignInForm(e) {
    e.preventDefault();
    let email = document.forms.formToSignIn.elements.signInEmail.value;
    let password = document.getElementById('signInPassword').value;
    let hashedPassword = sha256(password);
    queryAccount(email, hashedPassword);
    email = null;
    password = null;
    hashedPassword = null;
  }
  function logOut(e) {
    setIsActive(null);
    setUserEmail(null);
    setUserFirstName(null);
  }
  return (
    <div className="accountBody">
      <div className="accountVerified" style={{ display: 'none' }}>
        <h2 id="nameBadge">(o_O) <span>{userFirstName}</span> Ƹ̵̡Ӝ̵̨̄Ʒ</h2>
        <button type="button" className="glow-on-hover" id="logOutInBtn" onClick={(e) => { logOut(e); }}>log out</button>
      </div>
      <div className="accountVerificationProcess" style={{ display: 'block' }}>
        <div className="accountButton">
          <Button className="glow-on-hover" variant="outlined" onClick={(e) => { showWindow(); }}>Account</Button>
        </div>
        <div className="accountDiv" style={{ display: 'none' }}>
          <div className="signInForm">
            <button type="button" className="closeFormWindow" onClick={(e) => { closeAccountForm(e); }}>X</button>
            <h1>Sign In</h1>
            <form id="formToSignIn" onSubmit={(e) => { validateSignInForm(e); }}>
              <div>
                <label htmlFor="email">
                  Email:
                  <input name="signInEmail" type="email" placeholder="example@mail.com" required />
                </label>
              </div>
              <div>
                <label htmlFor="password">
                  Password:
                  <input id="signInPassword" type="password" placeholder="enter password" required />
                </label>
              </div>
              <Button id="cancelBtn" variant="outlined" color="error" onClick={(e) => { closeAccountForm(e); }}>cancel</Button>
              <button type="submit" className="glow-on-hover" id="signInBtn">Log In</button>
            </form>
            <div className="createOption">
              <p>Dont have an account? <button type="button" className="glow-on-hover" id="signUpFormBtn" onClick={(e) => { setSwitchForm('signUpForm'); }}>Sign Up!</button></p>
            </div>
          </div>
          <div className="createAccountForm" style={{ display: 'none' }}>
            <button type="button" className="closeFormWindow" onClick={(e) => { closeAccountForm(e); }}>X</button>
            <h1>Sign Up</h1>
            <form onSubmit={(e) => { validateCreateAccountForm(e); }} id="formToCreateAccount">
              <div>
                <label htmlFor="firstName">
                  First Name:
                  <input name="signUpFirstName" type="text" placeholder="enter first name" minLength="2" required />
                </label>
              </div>
              <div>
                <label htmlFor="lastName">
                  Last Name:
                  <input name="signUpLastName" type="text" placeholder="enter last name" minLength="2" required />
                </label>
              </div>
              <div>
                <label htmlFor="email">
                  Email:
                  <input name="signUpEmail" type="email" placeholder="email@sample.com" pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$" required />
                </label>
              </div>
              <div>
                <label htmlFor="password">
                  Password:
                  <input id="passwordField" type="password" placeholder="enter password" minLength="7" required />
                </label>
              </div>
              <button type="submit" className="glow-on-hover" id="createAccountBtn">Create Account</button>
              <Button id="cancelBtn2" variant="outlined" color="error" onClick={(e) => { closeAccountForm(e); }}>cancel</Button>
              <button type="button" className="glow-on-hover" id="returnToSignInFormBtn" onClick={(e) => { setSwitchForm('signInForm'); }}>Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
