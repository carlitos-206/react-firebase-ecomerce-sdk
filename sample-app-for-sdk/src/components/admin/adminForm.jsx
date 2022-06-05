import React, { useState } from 'react';

import './adminForm.css';
//  BootStrap Components
import Form from 'react-bootstrap/Form';

import Card from 'react-bootstrap/Card';

//  React Hook Form
import { useForm } from 'react-hook-form';

//  Material UI Component
import Button from '@mui/material/Button';

//  Currency Input NPM --- cant validate so RIP
// import MoneyInput from '@rschpdr/react-money-input';

// UUID
// import { v4 } from 'uuid';
// Firebase DB
import { addDoc, collection } from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, imgDB } from '../../db';

export default function AdminForm() {
  // React Form Validation Hook
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm();

  // Only gets called if theres no errors
  const [img, setImg] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const onSubmit = (data) => {
    const uploadFile = () => {
      if (img == null) return;
      const imageRef = ref(imgDB, `img/${data.itemName}_img`);
      uploadBytes(imageRef, img).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);
          setImgURL(url);
        });
      });
    };
    uploadFile();
    if (imgURL == null) return;
    const entriesRef = collection(db, 'storeItems');
    console.log(data);
    addDoc(entriesRef, {
      itemName: data.itemName,
      itemGender: data.gender,
      itemQuantity: data.quantity,
      itemImg: imgURL,
      itemSalePercent: data.salePercent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  // Clear Form
  const clearForm = () => {
    document.getElementsByClassName('adminForm')[0].reset();
    clearErrors();
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
      document.getElementById('saleField').value = '';
    }
  };
  return (
    <div className="adminFormContainer">
      <Card className="adminFormCard">
        <Card.Body>
          <Card.Title>Create New Store Item</Card.Title>
          <br />
          <Form onSubmit={handleSubmit(onSubmit)} className="adminForm">
            <Form.Group className="mb-3 itemNameField" controlId="formItemID">
              <Form.Label>Enter Item Title</Form.Label>
              <input className="adminInputFields" id="adminItemNameField" type="text" {...register('itemName', { required: true, minLength: 2, maxLength: 20 })} placeholder="Enter Item Name" />
              <div className="errors">
                {errors.itemName?.type === 'required' && 'Item name is required'}
                {errors.itemName?.type === 'minLength' && 'Must be more than 2 letters'}
                {errors.itemName?.type === 'maxLength' && 'Must be less than 20 letters'}
              </div>
            </Form.Group>
            <Form.Group className="mb-3 itemGenderField" controlId="formGenderID">
              <Form.Label>Gender</Form.Label>
              <select {...register('gender', { required: true })}>
                <option value="" selected hidden>Select an Option</option>
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="female">Female</option>
              </select>
              <div className="errors">
                {errors.gender?.type === 'required' && 'Select Gender'}
              </div>
            </Form.Group>
            <Form.Group className="mb-3 itemPriceField" controlId="formPriceID">
              <Form.Label>Price $</Form.Label>
              <input type="number" step="0.01" placeholder="Enter Price" {...register('price', { required: true })} />
              <div className="errors">
                {errors.price?.type === 'required' && 'Enter Price'}
              </div>
            </Form.Group>
            <Form.Group className="mb-3 itemQuantityField" controlId="formQuantentyID">
              <Form.Label>Quantity:</Form.Label>
              <input type="number" step="1" placeholder="Enter Available Quantity" {...register('quantity', { required: true })} />
              <div className="errors">
                {errors.quantity?.type === 'required' && 'Enter Quantity'}
              </div>
            </Form.Group>
            <Form.Group className="mb-3 itemImgField" controlId="ItemImgID">
              <Form.Label>Upload Img</Form.Label>
              <input type="file" {...register('img', { required: true })} onChange={(event) => { setImg(event.target.files[0]); }} />
              <div className="errors">
                {errors.img?.type === 'required' && 'File Missing'}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Place Item On Sale</Form.Label>
              <input type="checkbox" id="saleCheckBox" onClick={(e) => { displaySaleBar(e); }} />
              <input type="number" step={1} id="saleField" style={{ display: 'none' }} placeholder="0" {...register('salePercent')} />
              <div className="errors" id="saleError" style={{ display: 'none' }}>
                <p>Uncheck box or enter sale percent</p>
              </div>
            </Form.Group>
            <Button variant="outlined" color="error" onClick={(e) => { clearForm(e); clearErrors(); }}>Cancel</Button>
            <Button variant="outlined" type="Submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
