import { useState, useEffect } from 'react';
import { productAPI, categoryAPI, orderAPI } from '../services/api';

export default function AdminPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getAll({ per_page: 1000 }),
      categoryAPI.getAll(),
      orderAPI.adminGetAll({ per_page: 5 }),
    ])
      .then(([prodRes, catRes, orderRes]) => {
        setStats({
          products: prodRes.data.total ?? prodRes.data.data?.length ?? 0,
          categories: catRes.data.length,
          orders: orderRes.data.total ?? orderRes.data.data?.length ?? 0,
        });
        setOrders(orderRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">កំពុងផ្ទុក...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-hero">
          <div>
            <h1>ផ្ទាំងគ្រប់គ្រង</h1>
            <p>ស្វាគមន៍ទៅកាន់ផ្នែកគ្រប់គ្រងរបស់អ្នក</p>
          </div>
        </div>

        <div className="admin-metrics">
          <div className="metric-card">
            <h3>ផលិតផល</h3>
            <p>{stats.products}</p>
          </div>
          <div className="metric-card">
            <h3>ប្រភេទ</h3>
            <p>{stats.categories}</p>
          </div>
          <div className="metric-card">
            <h3>ការបញ្ជាទិញ</h3>
            <p>{stats.orders}</p>
          </div>
        </div>

        <div className="admin-section">
          <h2>ការបញ្ជាទិញថ្មីៗ</h2>
          {orders.length === 0 ? (
            <p>មិនមានការបញ្ជាទិញថ្មីនៅពេលនេះទេ</p>
          ) : (
            <div className="admin-orders-table">
              <div className="table-row table-heading">
                <span>លេខ</span>
                <span>ស្ថានភាព</span>
                <span>សរុប</span>
                <span>កាលបរិច្ឆេទ</span>
              </div>
              {orders.map(order => (
                <div key={order._id} className="table-row">
                  <span>{order.order_number}</span>
                  <span>{order.status}</span>
                  <span>${order.total.toFixed(2)}</span>
                  <span>{new Date(order.created_at).toLocaleDateString('km-KH')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
