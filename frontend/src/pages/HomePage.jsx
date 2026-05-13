import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getFeatured(),
      categoryAPI.getAll(),
    ]).then(([prodRes, catRes]) => {
      setFeatured(prodRes.data);
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>ស្វាគមន៍មកកាន់ <span>ហាងខ្មែរ</span></h1>
          <p>ទំនិញល្អ តម្លៃសមរម្យ ដឹកជញ្ជូនលឿន</p>
          <Link to="/products" className="btn-primary btn-lg">
            មើលផលិតផលទាំងអស់ →
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">ប្រភេទផលិតផល</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products?category_id=${cat._id}`}
                className="category-card"
              >
                {cat.image && <img src={cat.image} alt={cat.name_km} />}
                <span>{cat.name_km || cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">ផលិតផលពិសេស</h2>
            <Link to="/products?featured=1" className="view-all">មើលទាំងអស់ →</Link>
          </div>
          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
