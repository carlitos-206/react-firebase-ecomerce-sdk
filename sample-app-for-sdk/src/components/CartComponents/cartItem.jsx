import React from "react";
import PropTypes from 'prop-types';

export default function CartItemBuilder({key, houseType, city, country, img, cost}){
  return(
    <div className="cartItem" id={key}>
      <img src={img} alt={houseType} id={`cartIMG_${key}`} className="CartImg" />
      <p>{houseType} - {city}, {country}</p>
      <p>{cost}</p>
    </div>
  )
}

CartItemBuilder.propTypes ={
  key: PropTypes.number.isRequired,
  houseType: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired
}