import React, { useState, useEffect } from 'react';

import './adminStore.css';
import Button from '@mui/material/Button';
// Firabse
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { db, imgDB } from '../../db';
import AdminEditItem from './adminEdit';

export default function AdminStoreItems() {
  const [entries, setEntries] = useState([]);
  const [editItemID, setEditItemID] = useState(null);
  const [itemToBeEdited, setItemToBeEdiTed] = useState(null);
  const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
  useEffect(() => {
    const items = query(
      collection(db, 'storeItems'),
      orderBy('updatedAt', 'desc'),
    );
    const unsubscribe = onSnapshot(
      items,
      (snapshot) => {
        setEntries(snapshot.docs);
      },
    );
    return () => { unsubscribe(); };
  }, []);
  const withSalePrice = (sale, price) => {
    if (sale === '' || sale === 0) return price;
    const newPrice = (price - (price * (sale * 0.01))).toFixed(2);
    return newPrice;
  };
  useEffect(() => {
    if (itemToBeEdited !== null) {
      document.getElementById('itemIDField').innerText = `ID: ${itemToBeEdited.uniqueID}`;
      document.getElementById('itemNameField').setAttribute('value', `${itemToBeEdited.itemName}`);
      document.getElementById('itemImgField').setAttribute('src', `${itemToBeEdited.itemImg}`);
      document.getElementById('itemPriceField').setAttribute('value', `${itemToBeEdited.itemPrice}`);
      document.getElementById('itemQuantityField').setAttribute('value', `${itemToBeEdited.itemQuantity}`);
      document.getElementById('itemSalePercentField').setAttribute('value', `${itemToBeEdited.itemSalePercent}`);
    } else {
      document.getElementsByClassName('editForm')[0].setAttribute('style', 'display: none');
      setEditItemID(null);
    }
  }, [itemToBeEdited]);
  useEffect(() => {
    async function callItemToEdit(id) {
      const docRef = doc(db, 'storeItems', id);
      const snapShot = await getDoc(docRef);
      if (snapShot.exists) {
        setItemToBeEdiTed(snapShot.data());
        document.getElementsByClassName('editForm')[0].setAttribute('style', 'display: block');
      } else {
        alert('ERR: CONTACT SUPPORT');
      }
    }
    if (editItemID) {
      callItemToEdit(editItemID);
    }
  }, [editItemID]);
  async function updateFireBase(id, item) {
    const storeItemRef = doc(db, 'storeItems', id);
    await updateDoc(storeItemRef, {
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemQuantity: item.itemQuantity,
      itemSalePercent: item.itemSalePercent,
      updatedAt: new Date().toString(),
    });
    setItemToBeEdiTed(null);
  }

  async function updateItemForm(e) {
    e.preventDefault();
    const newName = document.forms.editItemForm.newItemName.value;
    const newPrice = document.forms.editItemForm.newItemPrice.value;
    const newQuantity = document.forms.editItemForm.newItemQuantity.value;
    const newSalePercent = document.forms.editItemForm.newItemSalePercent.value;
    const newItem = {
      itemName: newName,
      itemPrice: newPrice,
      itemQuantity: newQuantity,
      itemSalePercent: newSalePercent,
    };
    updateFireBase(editItemID, newItem);
  }
  async function deleteItem(id) {
    if (window.confirm('Are you sure you want to delete this item? It cannot be undone.')) {
      const storeItemRef = doc(db, 'storeItems', id);
      await deleteDoc(storeItemRef);
      setItemToBeDeleted(null);
    }
  }
  return (
    <div>
      <div className="adminStore">
        {entries.map((entry, index) => {
          return (
            <div className="adminStoreItemCard" key={index.toString()}>
              <h1 className="adminStoreItemCardTitle">{entry.data().itemName}</h1>
              <img src={entry.data().itemImg} alt={`${entry.data().itemName}_img`} />
              <p>Price: ${entry.data().itemPrice}</p>
              <p>Quantity: {entry.data().itemQuantity}</p>
              <p>Sale: {entry.data().itemSalePercent}%</p>
              <p>New Price: ${withSalePrice(entry.data().itemSalePercent, entry.data().itemPrice)}</p>
              {/* <p>{entry.data().createdAt}</p>
              <p>{entry.data().updatedAt}</p> */}
              <div className="button">
                <Button variant="contained" id="btn1" color="success" onClick={(e) => { setEditItemID(entry._document.key.path.segments[6]); }}>Edit</Button>
                <Button variant="contained" id="btn2" color="error" onClick={(e) => { deleteItem(entry._document.key.path.segments[6]); }}>Permantly Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="editForm" style={{ display: 'none' }}>
        <form name="editItemForm" className="adminStoreItemCard" id="editFormCSS" onSubmit={(e) => { updateItemForm(e); }}>
          <p id="itemIDField">id</p>
          <br />
          <img id="itemImgField" src="#" alt="itemImg" />
          <br />
          <label htmlFor="newItemName">
            Title:
            <input id="itemNameField" name="newItemName" type="text" />
          </label>
          <br />
          <label htmlFor="newItemPrice">
            Price:
            <input id="itemPriceField" name="newItemPrice" type="text" />
          </label>
          <br />
          <label htmlFor="newItemQuantity">
            Quantity:
            <input id="itemQuantityField" name="newItemQuantity" type="text" />
          </label>
          <br />
          <label htmlFor="newItemSalePercent">
            Sale %:
            <input id="itemSalePercentField" name="newItemSalePercent" type="text" />
          </label>
          <br />
          <button id="btn3" type="submit">submit</button>
          <button id="btn4" type="button" onClick={(e) => { setItemToBeEdiTed(null); }}> Cancel</button>
        </form>
      </div>
    </div>
  );
}
