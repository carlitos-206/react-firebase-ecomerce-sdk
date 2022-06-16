import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className="navBar">
      <h2><Link to="/all"> All</Link> |</h2>
      <h2><Link to="/men"> Men</Link> |</h2>
      <h2><Link to="/women">Women</Link> |</h2>
      <h2><Link to="/unisex">Unisex</Link> |</h2>
      <h2><Link to="/onSale">SALE</Link> |</h2>
    </div>
  );
}
