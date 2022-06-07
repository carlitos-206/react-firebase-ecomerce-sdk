import React from 'react';
import PropTypes from 'prop-types';
// BootStrap
import Card from 'react-bootstrap/Card';

export default function ItemCardbuilder({
  itemName,
  itemGender,
  itemPrice,
  itemQuantity,
  itemImg,
  itemIsOnSale,
}) {
  // if (itemIsOnSale !== '') {
  //   const percentSale = parseInt(itemIsOnSale);
  //   const newPrice = parseInt(itemPrice) - (parseInt(itemPrice) * (percentSale * 0.01));
  // }
  return (
    <div className="adminStoreItems">
      <Card className="adminStoreItemCard">
        <Card.Body>
          <Card.Title>{itemName}</Card.Title>
          <img className="itemName" src={itemImg} alt={`${itemName}IMG`} />
          <Card.Text>
            $
            {itemPrice}
            salePrice
            {itemIsOnSale}
          </Card.Text>
          <Card.Text>{itemGender}</Card.Text>
          <Card.Text>{itemQuantity}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
ItemCardbuilder.propTypes = {
  itemName: PropTypes.string.isRequired,
  itemGender: PropTypes.string.isRequired,
  itemPrice: PropTypes.string.isRequired,
  itemQuantity: PropTypes.string.isRequired,
  itemImg: PropTypes.string.isRequired,
  itemIsOnSale: PropTypes.string.isRequired,
};
