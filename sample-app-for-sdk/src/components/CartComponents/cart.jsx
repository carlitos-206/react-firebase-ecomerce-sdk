import React, { useState }from 'react';
import Button from '@mui/material/Button'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { IconButton, Badge } from '@mui/material';
import CartItemBuilder from './cartItem';
import './cartStyle.css'
import { db } from '../../db'
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Cart() {
  const[viewCart , setViewCart]=useState("hiddenCart")
    async function showCart(e){
      const isVisible = document.getElementById('cartVisible')
      console.log(isVisible.className)
      if(isVisible.className === 'showCart') {
        setViewCart("hiddenCart")
      }
      if(isVisible.className === 'hiddenCart'){
        setViewCart("showCart")
      } 
    }
    

  
  return (
    <div>
      <div className='shoppingCart'>
          <IconButton className='cartLogo' onClick={(e)=>{ showCart(e); }} size='large'color="inherit">
            <Badge badgeContent='0' color="error">
              <ShoppingBasketIcon />
            </Badge>
          </IconButton>
        </div>
        <div className={viewCart} id="cartVisible">
          {/* {
            items.map((item, index)=> {
              return (
                <div>
                <CartItemBuilder
                key={index} 
                houseType={item.houseType} 
                city={item.city} 
                country={item.country} 
                img={item.img} 
                cost={item.cost}/>
                <Button variant="outlined" color="error" onClick={(e)=>{minus(e, item.houseType, item.city, item.country, item.img, item.dataIndex, item.cost)}}>Remove</Button>
                </div>
              )
            })} */}
          <p>TOTAL: $cartTotalCost <span id='taxSpan'>( Taxes and Fees not included )</span> <span><Button id="checkoutBtn" variant='contained' color='error' onClick={()=>{alert("Demo ends here")}}>Checkout</Button></span></p>
        </div>
      </div>
  );
}
