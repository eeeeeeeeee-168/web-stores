import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្ដងទៀត');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>ចុះឈ្មោះ</h1>
        <p>បង្កើតគណនីថ្មីសម្រាប់ការជាវរបស់អ្នក</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ឈ្មោះ</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ឈ្មោះពេញ"
              required
            />
          </div>

          <div className="form-group">
            <label>អ៊ីមែល</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>លេខទូរស័ព្ទ</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="010 123 456"
            />
          </div>

          <div className="form-group">
            <label>ពាក្យសម្ងាត់</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>បញ្ជាក់ពាក្យសម្ងាត់</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'កំពុងចុះឈ្មោះ...' : 'ចុះឈ្មោះ'}
          </button>
        </form>

        <p className="auth-link">
          មានគណនីរួចហើយ? <Link to="/login">ចូល</Link>
        </p>
      </div>
    </div>
  );
}
