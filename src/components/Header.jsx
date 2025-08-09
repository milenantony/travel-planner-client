// client/src/components/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <motion.span className="logo-main" whileHover={{ letterSpacing: '1px' }}>Plan</motion.span>
        <motion.span className="logo-accent" whileHover={{ letterSpacing: '1px' }}>Trips</motion.span>
      </Link>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="nav-button">Logout</motion.button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}