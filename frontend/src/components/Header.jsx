import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onMenuClick, searchQuery, onSearchChange, onSearchSubmit }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
    onSearchSubmit(localSearch);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <Link to="/" className="logo">
          <svg viewBox="0 0 90 20" width="90" height="20">
            <path fill="#FF0000" d="M27.2 1.6c-.4-.2-.8-.3-1.3-.3H4.1C2.4 1.3 1 2.7 1 4.4v11.2c0 1.7 1.4 3.1 3.1 3.1h21.8c.5 0 1-.1 1.3-.3.8-.4 1.3-1.2 1.3-2.1V3.7c0-.9-.5-1.7-1.3-2.1zM18 10.5l-8.2 4.7V5.8L18 10.5z" />
            <text x="32" y="15" fill="white" fontSize="14" fontWeight="bold" fontFamily="Roboto">YouTube</text>
          </svg>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search videos..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
          </svg>
        </button>
      </form>

      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <img src={user.avatar} alt={user.username} className="user-avatar" />
            <span className="user-name">{user.username}</span>
            <button className="btn-secondary" onClick={logout}>Sign out</button>
          </div>
        ) : (
          <Link to="/auth" className="btn-primary sign-in-btn">Sign in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
