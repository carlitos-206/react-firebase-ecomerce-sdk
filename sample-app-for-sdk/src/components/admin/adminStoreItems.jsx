import React, { useState, useEffect } from 'react';

import './adminStore.css';
import Button from '@mui/material/Button';

// Firabse
import {
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../../db';

export default function AdminStoreItems() {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const items = query(
      collection(db, 'storeItems'),
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
  return (
    <div className="adminStore">
      {entries.map((entry) => {
        return (
          <div className="adminStoreItemCard">
            <h1 className="adminStoreItemCardTitle">{entry.data().itemName}</h1>
            <img src={entry.data().itemImg} alt={`${entry.data().itemName}_img`} />
            <p>Price: ${entry.data().itemPrice}</p>
            <p>Quantity: {entry.data().itemQuantity}</p>
            <p>Sale: {entry.data().itemSalePercent}%</p>
            <p>New Price: ${withSalePrice(entry.data().itemSalePercent, entry.data().itemPrice)}</p>
            {/* <p>{entry.data().createdAt}</p>
            <p>{entry.data().updatedAt}</p> */}
            <Button variant="outlined" color="success">ADD TO CART</Button>
          </div>
        );
      })}
    </div>
  );
}
