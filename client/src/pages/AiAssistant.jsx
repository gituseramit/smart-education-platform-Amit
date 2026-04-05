import ChatWindow from '../components/chat/ChatWindow';
import { motion } from 'framer-motion';

const T = { purple:'#AC6AFF', blue:'#858DFF', gold:'#FFC876' };

const AiAssistant = () => (
  <div style={{ display: 'flex', gap: '2.5rem', height: '100%', padding: '1.5rem 0' }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>
    
    {/* Main Chat Area */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#111827', letterSpacing: '-0.03em' }}>
            AI Study <span style={{ background:`linear-gradient(135deg,var(--cs-primary),#4f46e5)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Assistant</span>
          </h1>
          <p style={{ margin: 0, color: 'var(--cs-text-muted)', fontSize: '1rem', fontWeight: 500 }}>
            Academic wisdom powered by Gemini. Ask, explore, and master.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            background: 'white', 
            border: '1.5px solid var(--cs-border)', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '16px', 
            fontWeight: 800, 
            fontSize: '0.85rem',
            color: '#111827',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem',
            cursor: 'pointer'
          }}>
            🕒 Sessions
          </button>
          <button className="cs-button-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '16px', fontSize: '0.85rem' }}>
            📘 Library
          </button>
        </div>
      </div>

      {/* Chat Window Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', border: '1.5px solid var(--cs-border)', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.04)' }}>
        <ChatWindow />
      </div>

      {/* Footer Branding */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)', fontWeight: 800, letterSpacing: '0.08em' }}>✓ VERIFIED BY GEMINI</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--cs-text-light)', fontWeight: 800, letterSpacing: '0.08em' }}>🔐 PROTECTED DATA</span>
      </div>
    </div>

    {/* Study Intelligence Sidebar */}
    <aside style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 .5rem', color: '#111827' }}>Intelligence</h2>
      
      <div className="cs-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--cs-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Summaries</h3>
          <span style={{ color: 'var(--cs-primary)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>View All</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { title: 'Vector Field Theory', date: '2 hours ago' },
            { title: 'Quantum Mechanics Intro', date: 'Yesterday' }
          ].map(summary => (
            <div key={summary.title} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1.5px solid var(--cs-border)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.25rem', color: '#111827' }}>{summary.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cs-text-muted)', fontWeight: 600 }}>{summary.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cs-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Queries</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            'Explain Heapsort complexity',
            'Visual proof of Pythagoras',
            'Organic Chemistry help'
          ].map(query => (
            <div key={query} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.85rem 1rem', 
              background: '#white', 
              border: '1.5px solid var(--cs-border)',
              borderRadius: '14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#374151'
            }}>
              🔍 {query}
            </div>
          ))}
        </div>
      </div>

      <div className="cs-card" style={{ background: 'var(--cs-accent-wellness)', color: 'white', border: 'none', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.9, letterSpacing: '0.05em' }}>Success Path</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>12/15 Mastery</div>
        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: '80%', height: '100%', background: 'white', borderRadius: 10 }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="cs-card" style={{ flex: 1, background: '#f0fdfa', border: '1.5px solid #ccfbf1', textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#134e4a', textTransform: 'uppercase' }}>3 DAY STREAK</div>
        </div>
        <div className="cs-card" style={{ flex: 1, background: '#eff6ff', border: '1.5px solid #dbeafe', textAlign: 'center', padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase' }}>AI READY</div>
        </div>
      </div>
    </aside>
  </div>
);

export default AiAssistant;
