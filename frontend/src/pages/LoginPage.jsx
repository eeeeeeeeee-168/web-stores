import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const [params]              = useSearchParams();
  const redirect              = params.get('redirect') || '/';

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្ដងទៀត');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>ចូលប្រព័ន្ធ</h1>
        <p>ស្វាគមន៍មកវិញ!</p>

        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'កំពុងចូល...' : 'ចូលប្រព័ន្ធ'}
          </button>
        </form>

        <p className="auth-link">
          មិនទាន់មានគណនី? <Link to="/register">ចុះឈ្មោះ</Link>
        </p>
      </div>
    </div>
  );
}
