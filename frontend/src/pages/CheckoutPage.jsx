import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cash',   label: 'បង់ប្រាក់នៅពេលទទួល', icon: '💵' },
  { id: 'aba',    label: 'ABA Pay',              icon: '🏦' },
  { id: 'wing',   label: 'Wing',                 icon: '🦅' },
  { id: 'bakong', label: 'Bakong',               icon: '🇰🇭' },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate                    = useNavigate();
  const [loading, setLoading]       = useState(false);
  const [payment, setPayment]       = useState('cash');
  const [address, setAddress]       = useState({
    name: '', phone: '', address: '', city: 'ភ្នំពេញ',
  });

  const shippingFee = total >= 50 ? 0 : 2.5;

  const handleChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await orderAPI.create({
        items:            items.map(i => ({ product_id: i.product_id, qty: i.qty })),
        payment_method:   payment,
        shipping_address: address,
      });
      clearCart();
      toast.success('បញ្ជាទិញបានជោគជ័យ!');
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាម');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>ទូទាត់ប្រាក់</h1>

        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>អាសយដ្ឋានដឹក</h2>
            {['name', 'phone', 'address', 'city'].map(field => (
              <div key={field} className="form-group">
                <label>
                  {field === 'name' ? 'ឈ្មោះ' :
                   field === 'phone' ? 'លេខទូរស័ព្ទ' :
                   field === 'address' ? 'អាសយដ្ឋាន' : 'ទីក្រុង/ខេត្ត'}
                </label>
                <input
                  name={field}
                  value={address[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <h2>វិធីទូទាត់</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(m => (
                <label
                  key={m.id}
                  className={`payment-option ${payment === m.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                  />
                  <span>{m.icon} {m.label}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'កំពុងបញ្ជាទិញ...' : 'បញ្ជាក់ការទិញ'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>ការបញ្ជាទិញ</h2>
            {items.map(item => (
              <div key={item.product_id} className="summary-item">
                <img src={item.image || '/placeholder.png'} alt={item.name_km} />
                <div>
                  <p>{item.name_km || item.name}</p>
                  <p>x{item.qty}</p>
                </div>
                <p>${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row">
              <span>សរុបរង</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>ថ្លៃដឹក</span>
              <span>{shippingFee === 0 ? 'ឥតគិតថ្លៃ' : `$${shippingFee}`}</span>
            </div>
            <div className="summary-total">
              <span>សរុប</span>
              <span>${(total + shippingFee).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
