import React from 'react';

import {
  Routes,
  Route,
  Link,
  Outlet,
} from 'react-router-dom';

import AdminPage from './components/admin/adminPage';

function App() {
  return (
    <div>
      <p><Link to="/"> Home </Link></p>
      {/* <p><Link to="/admin"> Admin </Link></p> */}
      <Outlet />
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
