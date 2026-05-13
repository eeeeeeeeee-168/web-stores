import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const addItem = useCart(s => s.addItem);

  useEffect(() => {
    setLoading(true);
    productAPI.getOne(id)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem(product, qty);
  };

  if (loading) {
    return <div className="loading">កំពុងផ្ទុក...</div>;
  }

  if (!product) {
    return (
      <div className="empty-state">
        <h2>មិនមានផលិតផលនេះទេ</h2>
        <Link to="/products" className="btn-primary">ទៅមើលផលិតផល</Link>
      </div>
    );
  }

  const price = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-gallery">
            <img
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.name_km || product.name}
            />
            <div className="thumbnail-row">
              {product.images?.map((img, index) => (
                <img key={index} src={img} alt={`${product.name} ${index + 1}`} />
              ))}
            </div>
          </div>

          <div className="product-detail-info">
            <p className="product-category">
              ប្រភេទ: <Link to={`/products?category_id=${product.category_id}`}>{product.category?.name_km || product.category?.name || 'មិនមាន'}</Link>
            </p>
            <h1>{product.name_km || product.name}</h1>
            <p className="product-description">
              {product.description_km || product.description || 'ពណ៌នា ផលិតផល នេះ​ដែល​គ្មាន។'}
            </p>

            <div className="product-price-row">
              <span className="price-current">${price.toFixed(2)}</span>
              {hasDiscount && <span className="price-original">${product.price.toFixed(2)}</span>}
            </div>
            {hasDiscount && <p className="discount-badge">-{discount}%</p>}

            <div className="product-stock">
              {product.stock > 0 ? `ស្តុកនៅសល់ ${product.stock} ឯកតា` : 'អស់ស្តុក'}
            </div>

            <div className="product-actions">
              <div className="qty-input">
                <label>ចំនួន</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 1}
                  value={qty}
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <button
                className="btn-primary"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'អស់ស្តុក' : 'បន្ថែមទៅកង់'}
              </button>
            </div>

            <div className="product-details-meta">
              <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
              <p><strong>ទំងន់:</strong> {product.weight ? `${product.weight} ក្រាម` : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
