import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const TABS = [
  { id:'discussions', label:'Discussions',       icon:'💬' },
  { id:'discover',    label:'Discover Network',  icon:'🔍' },
  { id:'pending',     label:'Pending Requests',  icon:'⏳' },
  { id:'connections', label:'My Connections',    icon:'🤝' },
];

const Avatar = ({ user, size=48 }) => (
  <div style={{ 
    width: size, 
    height: size, 
    borderRadius: '50%', 
    background: '#e5e7eb', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 700, 
    fontSize: size * 0.35, 
    flexShrink: 0, 
    overflow: 'hidden',
    border: '1.5px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }}>
    {user?.profileImage && !user.profileImage.includes('ui-avatars') ? (
      <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
    ) : (
      <img src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`} alt="avatar" style={{ width: '100%', height: '100%' }} />
    )}
  </div>
);

const EmptyState = ({ icon, msg, action }) => (
  <div className="cs-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
    <p style={{ color: 'var(--cs-text-light)', fontSize: '1rem', fontWeight: 500, marginBottom: action ? '1.5rem' : 0 }}>{msg}</p>
    {action}
  </div>
);

const CommunityForum = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'discussions') { const { data } = await api.get('/community/posts'); setPosts(data); }
      else if (activeTab === 'discover') { const { data } = await api.get('/network/discover'); setDiscoverUsers(data); }
      else { const { data } = await api.get('/network/connections'); setFriends(data.friends||[]); setPendingRequests(data.incomingRequests||[]); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSendRequest  = async id => { try { await api.post(`/network/request/${id}`); setDiscoverUsers(p=>p.filter(u=>u._id!==id)); } catch(e) { alert(e.response?.data?.message||'Failed'); } };
  const handleAcceptRequest = async id => { try { await api.post(`/network/accept/${id}`); fetchData(); } catch(e) { console.error(e); } };
  const handleRejectRequest = async id => { try { await api.post(`/network/reject/${id}`); fetchData(); } catch(e) { console.error(e); } };
  const handleVideoCall    = id => navigate(`/mental-health?tab=video&callId=${id}`);

  const SkeletonCard = () => (
    <div className="cs-card" style={{ padding: '1.5rem' }}>
      {[70, 50, 90].map((w, i) => <div key={i} style={{ height: 12, borderRadius: 6, background: '#f3f4f6', marginBottom: 12, width: `${w}%` }} className="animate-pulse" />)}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111827' }}>Community Network</h1>
          <p style={{ margin: 0, color: 'var(--cs-text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Connect with peers, share discussions, and grow your student network on the Smart Education Platform.
          </p>
        </div>
        {activeTab === 'discussions' && (
          <button className="cs-button-primary">
            + New Post
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--cs-border)', paddingBottom: '0.5rem' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const badge = tab.id==='pending'&&pendingRequests.length>0 ? pendingRequests.length : tab.id==='connections'&&friends.length>0 ? friends.length : null;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                padding: '0.75rem 0', 
                background: 'none',
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                transition: 'all 0.2s',
                color: isActive ? 'var(--cs-primary)' : 'var(--cs-text-light)',
                position: 'relative',
                borderBottom: isActive ? '2px solid var(--cs-primary)' : '2px solid transparent',
                marginBottom: '-0.6rem'
              }}>
              <span>{tab.icon}</span>
              {tab.label}
              {badge && (
                <span style={{ 
                  background: 'var(--cs-primary)', 
                  color: 'white', 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '6px',
                  marginLeft: '0.25rem'
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

          {/* DISCUSSIONS */}
          {activeTab === 'discussions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {loading ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                : posts.length === 0 ? <EmptyState icon="💬" msg="No posts yet. Be the first to start a discussion!" />
                : posts.map(post => (
                  <div key={post._id} className="cs-card" style={{ padding: '1.75rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Avatar user={post.author} size={36} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{post.author?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--cs-text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className="cs-badge cs-badge-blue" style={{ fontSize: '0.65rem' }}>DISCUSSON</span>
                    </div>
                    
                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>{post.title}</h3>
                    <p style={{ color: 'var(--cs-text-light)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.content}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cs-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        🤍 {post.likes?.length || 0}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cs-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        💬 {post.commentsCount || 0} Comments
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* DISCOVER */}
          {activeTab === 'discover' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {loading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                : discoverUsers.length === 0 ? <EmptyState icon="🔍" msg="No new users to discover right now." />
                : discoverUsers.map(user => (
                  <div key={user._id} className="cs-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar user={user} size={64} />
                    <h3 style={{ margin: '1rem 0 0.25rem', fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cs-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{user.role}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--cs-text-muted)', marginBottom: '1.5rem', height: '2.4rem', overflow: 'hidden' }}>{user.university || 'Global Student'}</p>
                    <button onClick={() => handleSendRequest(user._id)} className="cs-button-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Connect
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* PENDING */}
          {activeTab === 'pending' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {loading ? [...Array(2)].map((_, i) => <SkeletonCard key={i} />)
                : pendingRequests.length === 0 ? <EmptyState icon="⏳" msg="No pending connection requests." />
                : pendingRequests.map(req => (
                  <div key={req._id} className="cs-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar user={req} size={64} />
                    <h3 style={{ margin: '1rem 0 0.25rem', fontSize: '1.1rem', fontWeight: 800 }}>{req.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--cs-text-muted)', marginBottom: '1.5rem' }}>{req.university || 'Global Student'}</p>
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                      <button onClick={() => handleAcceptRequest(req._id)} className="cs-button-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}>Accept</button>
                      <button onClick={() => handleRejectRequest(req._id)} className="cs-button-muted" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}>Decline</button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* CONNECTIONS */}
          {activeTab === 'connections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loading ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                : friends.length === 0 ? <EmptyState icon="🤝" msg="No connections yet." action={<button onClick={() => setActiveTab('discover')} className="cs-button-primary">Discover People</button>} />
                : friends.map(friend => (
                  <div key={friend._id} className="cs-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Avatar user={friend} size={48} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{friend.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--cs-text-muted)' }}>{friend.university || 'Global Student Network'}</div>
                      </div>
                    </div>
                    <button onClick={() => handleVideoCall(friend._id)} className="cs-button-primary" style={{ background: 'var(--cs-accent-wellness)', border: 'none' }}>
                      📹 Video Call
                    </button>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CommunityForum;
