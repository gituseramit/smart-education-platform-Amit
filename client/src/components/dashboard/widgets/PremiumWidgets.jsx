import React from 'react';

export const AIInsightsWidget = ({ stats = { mastery: 0, weeklyGain: 0, nextTopic: 'Initializing...' }, recentMessage = '' }) => (
  <div className="cs-card" style={{ flex: 2, padding: '2.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'var(--cs-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 10px 20px -5px rgba(30,64,185,0.2)' }}>🤖</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>Smart AI Tutor</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active in Cognitive Layer</p>
        </div>
      </div>
      <span className="text-[.7rem] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border-[1.5px] border-[var(--cs-border)] text-[#64748b] bg-[#f8fafc]">Online</span>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Recent Discussion</div>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1.5px solid var(--cs-border)' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic', fontWeight: 500 }}>
            "{recentMessage || "Hello! How can I help you today?"}"
          </p>
          <button style={{ background: 'none', border: 'none', color: 'var(--cs-primary)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Resume Wisdom Session <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </div>
      </div>
      
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Mastery Path</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.04em' }}>{stats.mastery}%</span>
          <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>+{stats.weeklyGain}% weekly gain</span>
        </div>
        <div style={{ width: '100%', height: 10, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ width: `${stats.mastery}%`, height: '100%', background: 'linear-gradient(90deg, var(--cs-primary), #4f46e5)', borderRadius: 10 }} />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
          Next Benchmark: <span style={{ color: '#111827', fontWeight: 800 }}>{stats.nextTopic}</span>
        </p>
      </div>
    </div>
  </div>
);

export const WellnessWidget = () => (
  <div className="cs-card" style={{ flex: 1, background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '1.5px solid #dcfce7', padding: '2.5rem' }}>
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧘</div>
      <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>Current Presence</h3>
      <p style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#166534', lineHeight: 1.5, fontWeight: 500 }}>
        How is your focused mind feeling today?
      </p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
      {[
        { label: 'CALM', icon: '🧘', color: '#ffffff' },
        { label: 'FOCUSED', icon: '⚡', color: '#ffffff', active: true },
        { label: 'TIRED', icon: '☁️', color: '#ffffff' }
      ].map(mood => (
        <button key={mood.label} style={{
          background: mood.active ? '#ffffff' : 'rgba(255,255,255,0.4)',
          border: mood.active ? '2px solid #22c55e' : '1.5px solid transparent',
          borderRadius: '20px',
          padding: '1.25rem 0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          boxShadow: mood.active ? '0 10px 20px -5px rgba(0,0,0,0.05)' : 'none',
          transition: 'all 0.3s'
        }}>
          <span style={{ fontSize: '1.5rem' }}>{mood.icon}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: mood.active ? '#166534' : '#64748b', textTransform: 'uppercase' }}>{mood.label}</span>
        </button>
      ))}
    </div>
    
    <div style={{ 
      background: 'white', 
      padding: '1.25rem', 
      borderRadius: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      fontSize: '0.9rem',
      fontWeight: 800,
      color: '#166534',
      border: '1.5px solid #dcfce7',
      boxShadow: '0 4px 10px -2px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
        Deep Breath Protocol in 15m
      </div>
    </div>
  </div>
);

export const MentorSessionsWidget = ({ sessions = [] }) => (
  <div className="cs-card" style={{ flex: 1, padding: '2.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>Mentorship Rituals</h3>
      <button style={{ background: 'none', border: 'none', color: 'var(--cs-primary)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Map</button>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {sessions.length > 0 ? sessions.map(session => (
        <div key={session._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: '#f8fafc', borderRadius: '24px', border: '1.5px solid var(--cs-border)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '14px', background: '#ffffff', border: '1.5px solid var(--cs-border)', overflow: 'hidden' }}>
              <img src={session.mentorId?.avatar || `https://ui-avatars.com/api/?name=${session.mentorId?.name || 'Mentor'}&background=f1f5f9&color=1e40af&bold=true`} alt="avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>{session.mentorId?.name || 'Mentor'}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{session.topic || 'Mentorship Session'}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--cs-primary)' }}>{new Date(session.startTime).toLocaleDateString()}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      )) : (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No upcoming rituals scheduled.</p>
      )}
    </div>
  </div>
);

export const CommunityPulseWidget = ({ posts = [] }) => (
  <div className="cs-card" style={{ flex: 1, padding: '2.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>Platform Pulse</h3>
      <button style={{ background: 'none', border: 'none', color: 'var(--cs-primary)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore All</button>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {posts.length > 0 ? posts.slice(0, 1).map(post => (
        <div key={post._id} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '28px', border: '1.5px solid var(--cs-border)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, background: 'var(--cs-primary)', color: 'white', px: '0.5rem', py: '0.15rem', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 6px' }}>{post.category?.toUpperCase() || 'TRENDING'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--cs-primary)', fontWeight: 800 }}>#{post.tags?.[0] || 'Community'}</span>
          </div>
          <h4 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.4, color: '#111827', letterSpacing: '-0.01em' }}>
            {post.title}
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
               <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#white', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                 <img src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name || 'A'}`} className="w-full h-full rounded-full" />
               </div>
               <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 12, fontWeight: 800 }}>{post.author?.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>
              <span>💭 {post.commentsCount || 0}</span>
              <span>✨ {post.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      )) : (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No recent activity on the platform.</p>
      )}
    </div>
  </div>
);
