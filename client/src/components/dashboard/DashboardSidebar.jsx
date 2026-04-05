import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

// ─── MENU CONFIG ────────────────────────────────────────────
const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
  { label: 'AI Tutor', path: '/ai-assistant', icon: '⚙️' },
  { label: 'Resources', path: '/resources', icon: '📚' },
  { label: 'Mentors', path: '/mentors', icon: '👥' },
  { label: 'Forum', path: '/community', icon: '💬' },
  { label: 'Wellness', path: '/mental-health', icon: '🧘' },
  { label: 'Career', path: '/internships', icon: '💼' },
];

const DashboardSidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const content = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: 'var(--cs-sidebar-bg)', 
      borderRight: '1px solid var(--cs-border)', 
      overflowX: 'hidden' 
    }}>
      {/* Sidebar Header / Logo */}
      <div style={{ 
        padding: '1.5rem 1rem', 
        marginBottom: '1rem' 
      }}>
        <div style={{ color: 'var(--cs-primary)', fontWeight: 700, fontSize: '1.2rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#111827' }}>Smart Education Platform</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)', fontWeight: 500 }}>AI Success Roadmap</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {menuItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Upgrade to Pro Card */}
      <div className="pro-card" style={{ 
        background: 'linear-gradient(135deg, #dbeafe, #eff6ff)', 
        border: '1px solid #bfdbfe',
        color: '#1e40af',
        margin: '1rem',
        borderRadius: '16px',
        padding: '1.25rem'
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Upgrade to Pro</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '1rem' }}>Unlock unlimited sessions and priority mentor access.</div>
        <button style={{ 
          width: '100%', 
          background: '#1e40af', 
          color: 'white', 
          border: 'none', 
          padding: '0.6rem', 
          borderRadius: '8px', 
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Unlock All Paths
        </button>
      </div>

      {/* Footer / User / Logout */}
      <div style={{ padding: '0.75rem 0.75rem 1.5rem', borderTop: '1px solid var(--cs-border)' }}>
        <NavLink to="/help" className="nav-item">
          <span style={{ fontSize: '1.2rem' }}>❓</span>
          <span>Help</span>
        </NavLink>
        <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.2rem' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:flex" style={{ width: 'var(--cs-sidebar-width)', flexShrink: 0, transition: 'width .3s', zIndex: 50 }}>
        <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 'var(--cs-sidebar-width)', transition: 'width .3s', zIndex: 50 }}>
          {content}
        </div>
      </div>
      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="lg:hidden" initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'tween', duration: .28 }}
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, zIndex: 60 }}>
            <div style={{ height: '100%' }}>{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
