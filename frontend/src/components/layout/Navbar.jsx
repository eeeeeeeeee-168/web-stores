import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const count = useCart(s => s.count);
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🛒 <span>ហាងខ្មែរ</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/">ទំព័រដើម</Link>
          <Link to="/products">ផលិតផល</Link>
          {isAdmin && <Link to="/admin">ផ្ទាំងគ្រប់គ្រង</Link>}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <FiShoppingCart size={22} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <button onClick={() => setOpen(!open)} className="user-btn">
                <FiUser size={22} />
                <span>{user?.name}</span>
              </button>
              {open && (
                <div className="dropdown">
                  <Link to="/orders" onClick={() => setOpen(false)}>ការបញ្ជាទិញរបស់ខ្ញុំ</Link>
                  <button onClick={handleLogout}>
                    <FiLogOut size={16} /> ចាកចេញ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary">ចូលប្រព័ន្ធ</Link>
          )}
        </div>

        {/* Mobile menu btn */}
        <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
          <FiMenu size={24} />
        </button>
      </div>
    </nav>
  );
}
