import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function ProductsPage() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState({});
  const [params, setParams]         = useSearchParams();

  const sortValue = params.get('sort') || 'created_at_desc';
  const [sort_by, sort_dir] = sortValue.split('_');

  const filters = {
    category_id: params.get('category_id') || '',
    search:      params.get('search') || '',
    min_price:   params.get('min_price') || '',
    max_price:   params.get('max_price') || '',
    sort_by,
    sort_dir,
    page:        params.get('page') || 1,
  };

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    productAPI.getAll(filters)
      .then(res => {
        setProducts(res.data.data);
        setPagination(res.data);
      })
      .finally(() => setLoading(false));
  }, [params.toString()]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', 1);
    setParams(next);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h3><FiFilter /> ត្រង</h3>

            {/* Search */}
            <div className="filter-group">
              <label>ស្វែងរក</label>
              <div className="search-input">
                <FiSearch />
                <input
                  type="text"
                  placeholder="ឈ្មោះផលិតផល..."
                  value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <label>ប្រភេទ</label>
              <div className="filter-options">
                <button
                  className={!filters.category_id ? 'active' : ''}
                  onClick={() => updateFilter('category_id', '')}
                >ទាំងអស់</button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={filters.category_id === cat._id ? 'active' : ''}
                    onClick={() => updateFilter('category_id', cat._id)}
                  >
                    {cat.name_km || cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>ថ្លៃ ($)</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="ទាប"
                  value={filters.min_price}
                  onChange={e => updateFilter('min_price', e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="ខ្ពស់"
                  value={filters.max_price}
                  onChange={e => updateFilter('max_price', e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label>តម្រៀប</label>
              <select
                value={sortValue}
                onChange={e => updateFilter('sort', e.target.value)}
              >
                <option value="created_at_desc">ថ្មីបំផុត</option>
                <option value="price_asc">តម្លៃ: ទាប→ខ្ពស់</option>
                <option value="price_desc">តម្លៃ: ខ្ពស់→ទាប</option>
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            <p className="results-count">
              {loading ? 'កំពុងផ្ទុក...' : `${pagination.total || 0} ផលិតផល`}
            </p>

            {loading ? (
              <div className="products-grid">
                {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>រកមិនឃើញផលិតផល</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="pagination">
                {[...Array(pagination.last_page)].map((_, i) => (
                  <button
                    key={i}
                    className={filters.page == i + 1 ? 'active' : ''}
                    onClick={() => updateFilter('page', i + 1)}
                  >{i + 1}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
