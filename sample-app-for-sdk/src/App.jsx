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
// import CollectArrival from './components/dataCollection/arrivalRequest';
import AccountWindow from './components/userAccounts/Account';

function App() {
  // CollectArrival();
  return (
    <div className="appContainer">
      <div className="imgFrame">
        <Link to="/"><img src={logo} alt="storeLogo" id="storeLogoImg" /></Link>
      </div>
      <div className="navBar">
        <h2><Link to="/all"> All</Link> |</h2>
        <h2><Link to="/men"> Men</Link> |</h2>
        <h2><Link to="/women">Women</Link> |</h2>
        <h2><Link to="/unisex">Unisex</Link> |</h2>
        <h2><Link to="/onSale">SALE</Link> |</h2>
      </div>
      <Routes>
        <Route exact path="/" element={<><StoreItems /> <AccountWindow /></>} />
        <Route exact path="/admin" element={<AdminPage />} />
        <Route path="/all" element={<><StoreItems /> <AccountWindow /></>} />
        <Route path="/men" element={<><MenQuery /> <AccountWindow /></>} />
        <Route path="/women" element={<><WomenQuery /> <AccountWindow /></>} />
        <Route path="/unisex" element={<><UnisexQuery /> <AccountWindow /></>} />
        <Route path="/onSale" element={<><SaleQuery /> <AccountWindow /></>} />
        {/* wildCard path */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
