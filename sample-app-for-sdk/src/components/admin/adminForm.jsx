import React, { useState } from 'react';

import './adminForm.css';
//  BootStrap Components
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

//  Material UI Component
import Button from '@mui/material/Button';

//  Currency Input NPM --- cant validate so RIP
// import MoneyInput from '@rschpdr/react-money-input';

// UUID
import { v4 } from 'uuid';
// Firebase DB
import { addDoc, collection } from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, imgDB } from '../../db';

export default function AdminForm() {
  // These set of States are from the AdminForm
  const [itemNameValue, setItemNameValue] = useState(null);
  const [itemGenderValue, setItemGenderValue] = useState(null);
  const [itemPriceValue, setItemPriceValue] = useState(null);
  const [itemQuantityValue, setItemQuantityValue] = useState(null);
  const [itemImgFile, setItemImgFile] = useState(null);
  const [itemSalePercentValue, setItemSalePercentValue] = useState(null);

  // This State comes from Firebase Storage
  // const [imgURL, setImgURL] = useState(null);

  function uploadFileToStorage() {
    return new Promise((resolve, reject) => {
      if (itemImgFile !== null || itemImgFile !== '') {
        const imageRef = ref(imgDB, `img/${itemNameValue.split(' ').join('')}_img---${v4()}`);
        uploadBytes(imageRef, itemImgFile).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            resolve(url.toString());
          });
        });
      } else {
        reject(new Error('file missing'));
      }
    });
  }
  async function uploadToFirestore() {
    const imgURL = await uploadFileToStorage();
    const entriesRef = collection(db, 'storeItems');
    addDoc(entriesRef, {
      itemName: itemNameValue,
      itemGender: itemGenderValue,
      itemQuantity: itemQuantityValue,
      itemImg: imgURL,
      itemPrice: itemPriceValue,
      itemSalePercent: itemSalePercentValue,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    });
  }
  const onSubmit = (e) => {
    e.preventDefault();
    // by clearing the form instantly it signals the user the request was sent
    document.getElementsByClassName('adminForm')[0].reset();
    document.getElementById('saleField').setAttribute('style', 'display:none');
    document.getElementById('saleError').setAttribute('style', 'display:none');
    document.getElementById('saleField').value = null;
    uploadToFirestore();
    setItemNameValue(null);
    setItemGenderValue(null);
    setItemPriceValue(null);
    setItemQuantityValue(null);
    setItemImgFile(null);
    setItemSalePercentValue(null);
  };

  // Clear Form
  const clearForm = () => {
    document.getElementsByClassName('adminForm')[0].reset();
    document.getElementById('saleError').setAttribute('style', 'display:none');
    document.getElementById('saleField').setAttribute('style', 'display:none');
  };
  const displaySaleBar = () => {
    const checkBox = document.getElementById('saleCheckBox');
    if (checkBox.checked === true) {
      document.getElementById('saleField').setAttribute('style', 'display:block');
      document.getElementById('saleError').setAttribute('style', 'display:block');
    } else {
      document.getElementById('saleField').setAttribute('style', 'display:none');
      document.getElementById('saleError').setAttribute('style', 'display:none');
      document.getElementById('saleField').value = null;
    }
  };
  return (
    <div className="adminFormContainer">
      <Card className="adminFormCard">
        <Card.Body>
          <Card.Title>Create New Store Item</Card.Title>
          <br />
          <Form onSubmit={(e) => { onSubmit(e); }} className="adminForm">
            <Form.Group className="mb-3 itemNameField" controlId="formItemID">
              <Form.Label>Enter Item Title</Form.Label>
              <input className="adminInputFields" id="adminItemNameField" type="text" placeholder="Enter Item Name" onChange={(e) => { setItemNameValue(e.target.value); }} minLength="2" required />
            </Form.Group>
            <Form.Group className="mb-3 itemGenderField" controlId="formGenderID">
              <Form.Label>Gender</Form.Label>
              <select onChange={(e) => { setItemGenderValue(e.target.value); }} required>
                <option value="" selected hidden disabled>Select an Option</option>
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="female">Female</option>
              </select>
            </Form.Group>
            <Form.Group className="mb-3 itemPriceField" controlId="formPriceID">
              <Form.Label>Price $</Form.Label>
              <input type="number" step="0.01" placeholder="Enter Price" onChange={(e) => { setItemPriceValue(e.target.value); }} required />
            </Form.Group>
            <Form.Group className="mb-3 itemQuantityField" controlId="formQuantentyID">
              <Form.Label>Quantity:</Form.Label>
              <input type="number" step="1" placeholder="Enter Available Quantity" onChange={(e) => { setItemQuantityValue(e.target.value); }} required />
            </Form.Group>
            <Form.Group className="mb-3 itemImgField" controlId="ItemImgID">
              <Form.Label>Upload Img</Form.Label>
              <input type="file" onChange={(e) => { setItemImgFile(e.target.files[0]); }} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Place Item On Sale</Form.Label>
              <input type="checkbox" id="saleCheckBox" onClick={(e) => { displaySaleBar(e); }} />
              <input type="number" step={1} id="saleField" style={{ display: 'none' }} placeholder="0" onChange={(e) => { setItemSalePercentValue(e.target.value); }} />
              <div className="errors" id="saleError" style={{ display: 'none' }}>
                <p>Uncheck box or enter sale percent</p>
              </div>
            </Form.Group>
            <Button variant="outlined" color="error" onClick={(e) => { clearForm(e); }}>Cancel</Button>
            <Button variant="outlined" type="Submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
