import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, Settings as SettingsIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Hard reload strips stray cross-site user styling memory
  };

  const NavItems = ({ isMobile }) => {
    const closeMenu = () => {
      if (isMobile) setIsMobileMenuOpen(false);
    };

    if (token) {
      return (
        <>
          <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/compiled-books" className="text-secondary" onClick={closeMenu}>Library</Link>
              <Link to="/admin" className="text-accent" onClick={closeMenu}>Admin</Link>
            </>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '1.5rem' : '1rem', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            marginLeft: isMobile ? '0' : '1rem',
            flexDirection: isMobile ? 'column' : 'row',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }} title="Settings" onClick={closeMenu}>
              <SettingsIcon size={20} /> {isMobile && "Settings"}
            </Link>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={closeMenu}>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
              ) : (
                <User size={18} />
              )}
              {user?.name}
            </Link>
            <button 
              onClick={() => { handleLogout(); closeMenu(); }}
              className="danger" 
              style={{ 
                padding: '0.5rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <Link to="/login" onClick={closeMenu}>Login</Link>
        <Link to="/register" onClick={closeMenu} style={{ width: isMobile ? '100%' : 'auto' }}>
          <button className="primary" style={{ padding: '0.5rem 1.5rem', width: isMobile ? '100%' : 'auto' }}>Sign Up</button>
        </Link>
      </>
    );
  };

  return (
    <header style={{ 
      padding: '1rem 2rem', 
      borderBottom: '1px solid var(--border)', 
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen className="text-accent" />
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Echo<span className="text-accent">Weave</span></h1>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="nav-desktop" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <NavItems isMobile={false} />
      </nav>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="nav-mobile-toggle secondary" 
        style={{ padding: '0.5rem' }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <NavItems isMobile={true} />
      </nav>
    </header>
  );
};

export default Navbar;
