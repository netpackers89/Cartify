// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/User/Home';
import { Login } from './pages/Auth/Login';
import { Cart } from './pages/User/Cart';
import { Products } from './pages/User/Products';
import { ProductDetail } from './pages/User/ProductDetail';
import { ProductDetails } from './pages/User/ProductDetails';
import { About } from './pages/User/About';
import { Favorites } from './pages/User/Favorites';
import { OrderTracking } from './pages/User/OrderTracking';
import SignUp from './pages/Auth/SignUp';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { 
  AdminLayout, 
  AdminDashboard, 
  AdminProducts, 
  AdminCategories, 
  AdminUsers,
  AdminSales
} from './pages/Admin';
import './App.css';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* ✅ Single Navbar for customer-facing pages */}
      <Navbar />
      
      <Routes>
        {/* Public / Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/order" element={<OrderTracking />} />
        <Route path="/orders" element={<OrderTracking />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

       
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout /> 
          </ProtectedAdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sales" element={<AdminSales />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
