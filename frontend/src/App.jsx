import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import HomePage    from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage    from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage  from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage   from './pages/AdminPage';

function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="loading">កំពុងផ្ទុក...</div>;
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="loading">កំពុងផ្ទុក...</div>;
  return isAdmin ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/products"  element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart"      element={<CartPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />

          <Route path="/checkout"  element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/orders"    element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />

          <Route path="/admin/*"   element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
