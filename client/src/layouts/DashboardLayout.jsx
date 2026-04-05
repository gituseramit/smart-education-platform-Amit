import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';
import { THEME_CSS } from '../theme';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  // Gate: mentor/counselor who haven't taken verification quiz yet.
  // isVerified===null means quiz never taken.
  const needsVerification = ['mentor','counselor'].includes(user?.role) && user?.isVerified === undefined;
  if (needsVerification) return <Navigate to="/verify" replace />;

  return (
    <div style={{ display:'flex', height:'100vh', background:'var(--cs-bg)', color:'var(--cs-text-main)', overflowX:'hidden' }}>
      
      <DashboardSidebar
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden', position:'relative', zIndex:1 }}>
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex:1, overflowY:'auto', padding:'1.75rem 1.5rem' }}>
          <div style={{ maxWidth:1600, margin:'0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:40, backdropFilter:'blur(4px)' }}
          className="lg:hidden"/>
      )}
    </div>
  );
};

export default DashboardLayout;
