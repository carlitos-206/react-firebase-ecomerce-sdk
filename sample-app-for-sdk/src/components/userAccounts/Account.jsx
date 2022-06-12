import React from 'react';
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
  function showWindow() {
    document.getElementsByClassName('accountDiv')[0].setAttribute('style', 'display:block');
  }
  function hideWindow() {
    document.getElementById('formToSignIn').reset();
    document.getElementById('formToCreateAccount').reset();
    document.getElementsByClassName('createAccountForm')[0].setAttribute('style', 'display:none');
    document.getElementsByClassName('signInForm')[0].setAttribute('style', 'display:block');
    document.getElementsByClassName('accountDiv')[0].setAttribute('style', 'display:none');
    document.getElementsByClassName('createAccountForm')[0].reset();
  }
  function showSignUpForm() {
    document.getElementsByClassName('signInForm')[0].setAttribute('style', 'display:none');
    document.getElementsByClassName('createAccountForm')[0].setAttribute('style', 'display:block');
  }
  function validateCreateAccountForm(e) {
    e.preventDefault();
    const email = document.forms.formToCreateAccount.elements.signUpEmail.value;
    const password = document.getElementById('passwordField').value;
    const firstName = document.forms.formToCreateAccount.elements.signUpFirstName.value;
    const lastName = document.forms.formToCreateAccount.elements.signUpLastName.value;
    CreateAccount(firstName, lastName, email, sha256(password));
    hideWindow();
  }
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
        hideWindow();
      }
    });
  }
  function validateSignInForm(e) {
    e.preventDefault();
    const email = document.forms.formToSignIn.elements.signInEmail.value;
    const password = document.getElementById('signInPassword').value;
    const hashedPassword = sha256(password);
    queryAccount(email, hashedPassword);
  }
  return (
    <div>
      <div className="accountButton">
        <Button className="glow-on-hover" variant="outlined" onClick={(e) => { showWindow(); }}>Account</Button>
      </div>
      <div className="accountDiv" style={{ display: 'none' }}>
        <div className="signInForm">
          <h1>Sign In</h1>
          <form id="formToSignIn" onSubmit={(e) => { validateSignInForm(e); }}>
            <div>
              <label htmlFor="email">
                Email:
                <input name="signInEmail" type="email" placeholder="example@mail.com" />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                Password:
                <input id="signInPassword" type="password" placeholder="enter password" />
              </label>
            </div>
            <Button id="cancelBtn" variant="outlined" color="error" onClick={(e) => { hideWindow(e); }}>cancel</Button>
            <button type="submit" className="glow-on-hover" id="signInBtn">Log In</button>
          </form>
          <div className="createOption">
            <p>Dont have an account? <button type="button" className="glow-on-hover" id="signUpFormBtn" onClick={(e) => { showSignUpForm(e); }}>Sign Up!</button></p>
          </div>
        </div>
        <div className="createAccountForm" style={{ display: 'none' }}>
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
            <Button id="cancelBtn2" variant="outlined" color="error" onClick={(e) => { hideWindow(e); }}>cancel</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
