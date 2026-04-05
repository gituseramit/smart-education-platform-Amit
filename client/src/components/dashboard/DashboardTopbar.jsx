import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', blue:'#858DFF', coral:'#FF776F' };

const DashboardTopbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  return (
    <header style={{ 
      height: 70, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 2rem', 
      background: 'rgba(248, 250, 252, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--cs-border)', 
      flexShrink: 0, 
      position: 'sticky', 
      top: 0, 
      zIndex: 40 
    }}>
      {/* Left: Branding & Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#111827', letterSpacing: '-0.02em' }}>Smart Education Platform</span>
        </Link>
        
        <nav className="hidden md:flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
          {[
            { label: 'Resources', path: '/resources' },
            { label: 'Support', path: '/mental-health' },
            { label: 'Community', path: '/community' }
          ].map(item => (
            <Link key={item.label} to={item.path} style={{ 
              textDecoration: 'none', 
              color: 'var(--cs-text-muted)', 
              fontSize: '0.9rem', 
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--cs-text-main)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--cs-text-muted)'}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Utilities & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search (Optional, if space allows) */}
        
        {/* Notification Bell */}
        <button style={{ background: 'none', border: 'none', color: 'var(--cs-text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>

        {/* Settings Gear */}
        <button style={{ background: 'none', border: 'none', color: 'var(--cs-text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>

        {/* User Avatar */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', ml: '0.5rem' }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            background: '#e5e7eb', 
            overflow: 'hidden',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
              alt="avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardTopbar;
