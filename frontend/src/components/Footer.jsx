import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Code, MessageCircle, Briefcase, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
        background: 'var(--surface)', 
        borderTop: '1px solid var(--border)',
        padding: '4rem 2rem 2rem 2rem',
        marginTop: 'auto'
    }}>
      <div className="container" style={{ padding: 0 }}>
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '3rem',
            marginBottom: '3rem'
        }}>
          {/* Brand & Contact */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <BookOpen className="text-accent" size={28} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Echo<span className="text-accent">Weave</span></h2>
            </Link>
            <p className="text-secondary mb-4" style={{ lineHeight: '1.6' }}>
              Unleashing collaborative creativity. Write together, read together, and publish the impossible.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> 123 Story Lane, Fiction City</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> +1 (555) 123-4567</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> hello@echoweave.app</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/" className="text-secondary" style={{ transition: 'color 0.2s' }}>Home</Link>
                <Link to="/compiled-books" className="text-secondary" style={{ transition: 'color 0.2s' }}>Library</Link>
                <Link to="/dashboard" className="text-secondary" style={{ transition: 'color 0.2s' }}>Dashboard</Link>
                <Link to="/login" className="text-secondary" style={{ transition: 'color 0.2s' }}>Login</Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>Collaborative Writing</a>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>AI Writing Assistant</a>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>Book Compilation</a>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>In-App Reader</a>
            </div>
          </div>

          {/* Resources & Social */}
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>Help Center</a>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>Privacy Policy</a>
                <a href="#" className="text-secondary" style={{ transition: 'color 0.2s' }}>Terms of Service</a>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} title="Twitter"><MessageCircle size={20} /></a>
                <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} title="GitHub"><Code size={20} /></a>
                <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} title="LinkedIn"><Briefcase size={20} /></a>
                <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} title="Facebook"><Users size={20} /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ 
            borderTop: '1px solid var(--border)', 
            paddingTop: '2rem', 
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
        }}>
            <p>&copy; {new Date().getFullYear()} EchoWeave Collaborative Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
