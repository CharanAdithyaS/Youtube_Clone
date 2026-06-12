import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav>
          <Link to="/" className="sidebar-item" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>Home</span>
          </Link>
          <Link to="/" className="sidebar-item" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
            <span>Shorts</span>
          </Link>
          <Link to="/" className="sidebar-item" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 18v-6H6l6-6 6 6h-4v6h-4z"/></svg>
            <span>Subscriptions</span>
          </Link>
          {user && (
            <>
              <hr />
              <Link to="/channel" className="sidebar-item" onClick={onClose}>
                <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span>Your Channel</span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
