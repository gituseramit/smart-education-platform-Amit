import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MoodTracker from '../components/mental-health/MoodTracker';
import AIVideoCall from '../components/mental-health/AIVideoCall';
import MentorTalk from '../components/mental-health/MentorTalk';
import PeerVideoCall from '../components/mental-health/PeerVideoCall';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF', pink:'#FF98E2' };

const TABS = [
  { id:'overview',   label:'Overview',       icon:'🧘' },
  { id:'mood',       label:'Mood Tracker',   icon:'🧠' },
  { id:'ai-guide',   label:'AI Guide',       icon:'🤖' },
  { id:'mentor',     label:'Peer & Mentor',  icon:'💬' },
  { id:'peer-call',  label:'Video Call',     icon:'📹' },
];

const RESOURCES = [
  { title:'Counselling Session', desc:'Private sessions with certified professionals for deep guidance.', icon:'📅', color:'var(--cs-accent-wellness)' },
  { title:'Self-Help Library',   desc:'Curated articles and tools for your mental resilience.', icon:'📚', color:'var(--cs-primary)' },
  { title:'24/7 Helpline',       desc:'Immediate support is always a call away — you are never alone.', icon:'📞', color:'var(--cs-accent-career)' },
  { title:'Support Groups',      desc:'Safe spaces to share experiences with fellow students.', icon:'🤝', color:'var(--cs-accent-wellness)' },
];

const MentalHealthSupport = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'video' ? 'peer-call' : 'overview');
  const [roomCodeContext, setRoomCodeContext] = useState(searchParams.get('callId') || '');

  useEffect(() => {
    if (searchParams.get('tab') === 'video' && searchParams.get('callId')) {
      setActiveTab('peer-call');
      setRoomCodeContext(searchParams.get('callId'));
    }
  }, [searchParams]);

  const handleStartCall = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCodeContext(code);
    setActiveTab('peer-call');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111827' }}>Wellness Center</h1>
          <p style={{ margin: 0, color: 'var(--cs-text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Your dedicated center for mental well-being. Track your emotions, talk to our AI guide, or connect with a supportive community.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1.25rem', 
        borderBottom: '1.5px solid var(--cs-border)', 
        paddingBottom: '0.25rem',
        overflowX: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }} className="hide-scrollbar">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
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
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {RESOURCES.map(r => (
                  <div key={r.title} className="cs-card" style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: r.color + '15', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1.5rem',
                      marginBottom: '1.25rem'
                    }}>
                      {r.icon}
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>{r.title}</h3>
                    <p style={{ margin: 0, color: 'var(--cs-text-light)', fontSize: '0.85rem', lineHeight: 1.6 }}>{r.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeTab === 'mood' && (
            <div className="cs-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800 }}>How are you feeling today?</h2>
              <p style={{ margin: '0 auto 2.5rem', color: 'var(--cs-text-muted)', maxWidth: '500px' }}>Take a moment to reflect. Your emotional journey is a vital part of your growth.</p>
              <MoodTracker />
            </div>
          )}

          {activeTab === 'ai-guide' && <AIVideoCall />}
          
          {activeTab === 'mentor' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800 }}>Professional Guidance</h2>
              <p style={{ margin: '0 auto 2rem', color: 'var(--cs-text-muted)', maxWidth: '600px' }}>Connect with mentors who prioritize your well-being alongside your career growth.</p>
              <MentorTalk onStartCall={handleStartCall} />
            </div>
          )}

          {activeTab === 'peer-call' && (
            <PeerVideoCall initialRoomCode={roomCodeContext} onEndCall={() => setRoomCodeContext('')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MentalHealthSupport;
