import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const STATUS_LABELS = {
  pending:   { label: 'កំពុងរង់ចាំ',  color: '#f59e0b' },
  confirmed: { label: 'បានបញ្ជាក់',    color: '#3b82f6' },
  shipping:  { label: 'កំពុងដឹក',      color: '#8b5cf6' },
  delivered: { label: 'បានទទួល',       color: '#10b981' },
  cancelled: { label: 'បានលុប',         color: '#ef4444' },
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">កំពុងផ្ទុក...</div>;

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h2>មិនទាន់មានការបញ្ជាទិញ</h2>
        <Link to="/products" className="btn-primary">ទៅទិញ →</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>ការបញ្ជាទិញរបស់ខ្ញុំ</h1>

        <div className="orders-list">
          {orders.map(order => {
            const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-number">{order.order_number}</p>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('km-KH')}
                    </p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: status.color + '20', color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image || '/placeholder.png'}
                      alt={item.name_km}
                      className="item-thumb"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <span className="more-items">+{order.items.length - 3}</span>
                  )}
                </div>

                <div className="order-footer">
                  <p className="order-total">
                    សរុប: <strong>${order.total.toFixed(2)}</strong>
                  </p>
                  <Link to={`/orders/${order._id}`} className="btn-outline">
                    មើលលម្អិត
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
