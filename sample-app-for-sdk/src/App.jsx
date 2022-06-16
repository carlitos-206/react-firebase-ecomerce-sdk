import React from 'react';
import './App.css';
import {
  Routes,
  Route,
  Link,
} from 'react-router-dom';

// React img import: logo img import
import logo from './storeLogo.png';
import AdminPage from './components/admin/adminPage';
import StoreItems from './components/home/storeItems';
import NotFoundPage from './components/global/404Page';
import MenQuery from './components/home/menQuery';
import WomenQuery from './components/home/womenQuery';
import SaleQuery from './components/home/saleQuery';
import UnisexQuery from './components/home/unisexQuery';
import CollectArrival from './components/dataCollection/arrivalRequest';
import AccountWindow from './components/userAccounts/Account';
import AdminEditItem from './components/admin/adminEdit';
import NavBar from './components/global/navBar';
import Footer from './components/global/footer';
import Cart from './components/CartComponents/cart';
function App() {
  CollectArrival();
  return (
    <div className="appContainer">
      <div className="imgFrame">
        <Link to="/"><img src={logo} alt="storeLogo" id="storeLogoImg" /></Link>
      </div>
      <Routes>
        <Route exact path="/" element={<><NavBar /> <StoreItems /> <AccountWindow /> <Cart /></>} />
        <Route exact path="/admin" element={<AdminPage />} />
        <Route exact path="/edit" element={<AdminEditItem />} />
        <Route path="/all" element={<><NavBar /> <StoreItems /> <AccountWindow /> <Cart /></>} />
        <Route path="/men" element={<><NavBar /> <MenQuery /> <AccountWindow /> <Cart /></>} />
        <Route path="/women" element={<><NavBar /> <WomenQuery /> <AccountWindow /> <Cart /></>} />
        <Route path="/unisex" element={<><NavBar /> <UnisexQuery /> <AccountWindow /> <Cart /></>} />
        <Route path="/onSale" element={<><NavBar /> <SaleQuery /> <AccountWindow /> <Cart /></>} />
        {/* wildCard path */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
