import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCart();
  const total    = useCart(s => s.total);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const shippingFee = total >= 50 ? 0 : 2.5;
  const grandTotal  = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <FiShoppingBag size={64} />
        <h2>កង់រូបរថទទេ</h2>
        <p>សូមបន្ថែមផលិតផលជាមុនសិន</p>
        <Link to="/products" className="btn-primary">ទិញផលិតផល</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>កង់រូបរថ ({items.length} មុខ)</h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.product_id} className="cart-item">
                <img src={item.image || '/placeholder.png'} alt={item.name_km} />
                <div className="cart-item-info">
                  <h3>{item.name_km || item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.product_id, item.qty - 1)}>
                    <FiMinus size={14} />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.product_id, item.qty + 1)}>
                    <FiPlus size={14} />
                  </button>
                </div>
                <p className="item-total">${(item.price * item.qty).toFixed(2)}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.product_id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}

            <button className="btn-clear" onClick={clearCart}>
              លុបទាំងអស់
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>សង្ខេបការទិញ</h2>
            <div className="summary-row">
              <span>សរុបរង</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>ថ្លៃដឹក</span>
              <span>{shippingFee === 0 ? 'ឥតគិតថ្លៃ' : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            {shippingFee > 0 && (
              <p className="shipping-note">ទិញលើស $50 ដឹកឥតគិតថ្លៃ</p>
            )}
            <div className="summary-total">
              <span>សរុបទាំងអស់</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              ទូទាត់ប្រាក់ →
            </button>
            <Link to="/products" className="continue-shopping">
              ← បន្តទិញ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
