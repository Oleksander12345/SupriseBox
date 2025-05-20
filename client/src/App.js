import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './Components/Layout';
import Dashboard from './pages/Dashboard';
import Boxes from './pages/Boxes';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Subcriptions from './pages/Subcriptions';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProtectRouter from './Components/ProtectRouter';
import Checkout from './pages/Checkout';
import StripeWrapper from './Components/StripeWrapper';



function App() {

  return (
    <Router>
      <Routes>
        {/* Сторінки без Layout */}
        <Route path="/login" element={<Login/>} />
        <Route path="/registration" element={<Registration />} />

        {/* Layout для всього іншого */}
        <Route path="/" element={<Layout/>}>
          {/* Вкладені маршрути */}
          <Route index element={<Dashboard />} />
          <Route path="boxes" element={<Boxes />} />
          <Route path="subcriptions" element={<Subcriptions />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<ProtectRouter><Profile /></ProtectRouter>} />
          <Route path="admin" element={<ProtectRouter><Admin /></ProtectRouter>} />
          {/* <Route path="chekout" element={<ProtectRouter><Checkout /></ProtectRouter>} /> */}
          <Route path="checkout" element={<ProtectRouter><StripeWrapper /></ProtectRouter>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
