import React, { useState, useEffect } from 'react';
import './storeItems.css';
import Button from '@mui/material/Button';

// Firabse
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../db';

export default function UnisexQuery() {
  const [cart, setCartArray] = useState([]);
  function addToCart(item) {
    setCartArray(prevCart => [...prevCart, item]);
    localStorage.setItem('unisex', JSON.stringify([...cart, item]));
  }
  
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const items = query(collection(db, 'storeItems'), where('itemGender', '==', 'unisex'));
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
  const isOnSale = (sale) => {
    if (sale !== null) {
      const saleValue = `${sale}% OFF`;
      return saleValue;
    }
  };
  return (
    <div className="storeContainer">
      {entries.map((entry, index) => {
        return (
          <div className="storeItemCard" key={index.toString()}>
            <h1 id="itemName">{entry.data().itemName}</h1>
            <img id="itemImg" src={entry.data().itemImg} alt={`${entry.data().itemName}_img`} />
            <p id="itemPrice">${entry.data().itemPrice}</p>
            <p id="isOnSale">{isOnSale(entry.data().itemSalePercent)}</p>
            <Button variant="outlined" id="itemButton" onClick={(e) => { addToCart(e.target.value = {
                'itemID' : entry.data().uniqueID,
                'itemName': entry.data().itemName,
                'itemImg': entry.data().itemImg,
                'itemPrice': entry.data().itemPrice,
                'itemQuantity': 1,
            })}} >ADD TO CART</Button>
          </div>
        );
      })}
    </div>
  );
}
