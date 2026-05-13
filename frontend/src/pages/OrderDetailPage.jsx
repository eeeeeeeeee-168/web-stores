import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  pending:   'កំពុងរង់ចាំ',
  confirmed: 'បានបញ្ជាក់',
  shipping:  'កំពុងដឹក',
  delivered: 'បានទទួល',
  cancelled: 'បានលុប',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    orderAPI.getOne(id)
      .then(res => setOrder(res.data))
      .catch(() => toast.error('មិនអាចទាញយកការបញ្ជាទិញបាន'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    setBusy(true);
    try {
      await orderAPI.cancel(order._id);
      setOrder({ ...order, status: 'cancelled' });
      toast.success('ការបញ្ជាទិញត្រូវបានលុប');
    } catch (err) {
      toast.error(err.response?.data?.message || 'មិនអាចលុបបាន');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="loading">កំពុងផ្ទុក...</div>;
  if (!order) return <div className="empty-state">មិនមានការបញ្ជាទិញនេះទេ</div>;

  const statusLabel = STATUS_LABELS[order.status] || order.status;

  return (
    <div className="order-detail-page">
      <div className="container">
        <button className="btn-outline" onClick={() => navigate(-1)}>← ត្រឡប់មក</button>
        <div className="order-detail-card">
          <div className="order-detail-header">
            <div>
              <h1>ការបញ្ជាទិញ {order.order_number}</h1>
              <p>{new Date(order.created_at).toLocaleString('km-KH')}</p>
            </div>
            <span className={`status-badge status-${order.status}`}>
              {statusLabel}
            </span>
          </div>

          <section>
            <h2>ទំនិញ</h2>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <img src={item.image || '/placeholder.png'} alt={item.name_km || item.name} />
                  <div>
                    <p>{item.name_km || item.name}</p>
                    <p>{item.qty} x ${item.price.toFixed(2)}</p>
                  </div>
                  <p>${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="order-summary-details">
            <div>
              <h2>រព្ធកិច្ច</h2>
              <p><strong>វិធីទូទាត់:</strong> {order.payment_method}</p>
              <p><strong>ស្ថានភាព:</strong> {statusLabel}</p>
            </div>
            <div>
              <h2>អាសយដ្ឋានដឹក</h2>
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.phone}</p>
              <p>{order.shipping_address.address}</p>
              <p>{order.shipping_address.city}</p>
            </div>
          </section>

          <section className="order-totals">
            <div className="summary-row">
              <span>សរុបរង</span><span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>ថ្លៃដឹក</span><span>${order.shipping_fee.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>សរុប</span><span>${order.total.toFixed(2)}</span>
            </div>
          </section>

          {['pending', 'confirmed'].includes(order.status) && (
            <button className="btn-danger" onClick={handleCancel} disabled={busy}>
              {busy ? 'កំពុងដំណើរការ...' : 'លុបការបញ្ជាទិញ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
