import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react'; // Added useState import

// Placeholder for theme object T
const T = {
  muted: '#64748b',
  primary: 'var(--cs-primary)',
  success: '#22c55e', // Example success color
};

// Placeholder for BwInput component
const BwInput = ({ label, id, type = 'text', name, value, onChange, placeholder, disabled }) => (
  <div>
    <label htmlFor={id} style={{ display:'block', fontSize:'.9rem', fontWeight:800, color:'#111827', marginBottom:'.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width:'100%', boxSizing:'border-box', padding:'1.1rem 1.25rem', background: disabled ? '#f8fafc' : 'white',
        border:'1.5px solid var(--cs-border)', borderRadius:20, color: disabled ? '#94a3b8' : '#111827',
        fontSize:'1rem', outline:'none', fontWeight: 600, transition: 'all 0.3s'
      }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = 'var(--cs-primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(30,64,185,0.06)'; }}}
      onBlur={e => { if (!disabled) { e.target.style.borderColor = 'var(--cs-border)'; e.target.style.boxShadow = 'none'; }}}
    />
  </div>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    university: user?.university || '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setSaved(false); };
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setLoading(true);
    try {
      await updateUser(form);
      setSaved(true); 
      setTimeout(() => setSaved(false), 3000); 
    } catch (err) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '0 1rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>
      
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '.5rem', color: '#111827' }}>Your Identity</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Architect your digital presence within the platform ecosystem.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
        style={{ background: 'white', border: '1.5px solid var(--cs-border)', borderRadius: 40, padding: '4rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px -15px rgba(0,0,0,0.03)' }}>
        
        {/* Avatar & info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3.5rem', paddingBottom: '3rem', borderBottom: '1.5px solid var(--cs-border)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 96, height: 96, borderRadius: 32, background: 'var(--cs-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 15px 35px rgba(30, 64, 185, 0.2)', border: '4px solid white' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {user?.isVerified && (
               <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#10b981', color: 'white', padding: '4px', borderRadius: '50%', border: '3px solid white', fontSize: '12px' }}>✓</div>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', marginBottom: '.35rem', letterSpacing: '-0.02em' }}>{user?.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.05rem' }}>{user?.email}</p>
              <span style={{ height: 16, width: 1.5, background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: user?.isVerified ? '#10b981' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {user?.isVerified ? '✦ VERIFIED SOUL' : '✧ UNVERIFIED IDENTITY'}
              </span>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'var(--cs-accent-wellness-light)', border: '1.5px solid var(--cs-primary)', color: 'var(--cs-primary)', fontSize: '.8rem', fontWeight: 900, padding: '.45rem 1.25rem', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.06em' }}>✦ {user?.role}</span>
            </div>
          </div>
        </div>

        {/* Global Settings / Options Grid */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <BwInput label="Full Designation" id="p-name" name="name" value={form.name} onChange={handleChange} placeholder="First and Last Name" />
            <BwInput label="Authenticated Email" id="p-email" type="email" name="email" value={user?.email} disabled />
            <BwInput label="Platform Branch" id="p-uni" name="university" value={form.university} onChange={handleChange} placeholder="University Name" />
            <BwInput label="Core Role" id="p-role" name="role" value={user?.role} disabled />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1.5rem' }}>
            <button type="submit" className="cs-button-primary" disabled={loading} style={{ padding: '1.1rem 3.5rem', borderRadius: '20px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Synchronizing...' : 'Update Platform Identity'}
            </button>
            {saved && (
              <motion.span initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: '1.05rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                ✓ Identity Synchronized
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
