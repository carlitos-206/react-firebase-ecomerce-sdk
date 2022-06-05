import React from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import AdminForm from './components/admin/adminForm';

function App() {
  return (
    <div>
      <p><Link to="/"> Home </Link></p>
      {/* <p><Link to="/admin"> Admin </Link></p> */}
      {/* <Outlet /> */}
      <Routes>
        <Route path="/admin" element={<AdminForm />} />
      </Routes>
    </div>
  );
}

export default App;
