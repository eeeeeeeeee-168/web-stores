import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p>
          © {new Date().getFullYear()} <strong>ហាងខ្មែរ</strong> — E-Commerce Cambodia
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          Made with ❤️ in Cambodia | Laravel + React.js + MongoDB
        </p>
      </div>
    </footer>
  );
}
