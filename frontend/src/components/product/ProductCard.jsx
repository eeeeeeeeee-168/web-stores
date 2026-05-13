import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const addItem = useCart(s => s.addItem);

  const price      = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discount   = hasDiscount
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Badge */}
      {hasDiscount && (
        <span className="badge badge-sale">-{discount}%</span>
      )}
      {product.stock === 0 && (
        <span className="badge badge-soldout">អស់ស្តុក</span>
      )}
      {product.is_featured && (
        <span className="badge badge-featured"><FiStar size={10}/> ពិសេស</span>
      )}

      {/* Image */}
      <Link to={`/products/${product._id}`}>
        <div className="product-image">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name_km || product.name}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name_km || product.name}</h3>
        </Link>

        <div className="product-price">
          <span className="price-current">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="price-original">${product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          className="btn-add-cart"
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
        >
          <FiShoppingCart size={16} />
          {product.stock === 0 ? 'អស់ស្តុក' : 'បន្ថែមទៅកង់'}
        </button>
      </div>
    </div>
  );
}
