import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const T = { 
  primary: 'var(--cs-primary)', 
  border: 'var(--cs-border)', 
  text: 'var(--cs-text-main)', 
  muted: 'var(--cs-text-muted)',
  light: 'var(--cs-text-light)',
  success: 'var(--cs-accent-wellness)'
};

const BwInput = ({ label, id, type='text', name, value, onChange, disabled, placeholder }) => (
  <div>
    <label htmlFor={id} style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#374151', marginBottom:'.5rem' }}>{label}</label>
    <input id={id} type={type} name={name} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
      style={{ width:'100%', boxSizing:'border-box', padding:'.85rem 1rem', background: disabled?'#f8fafc':'white', border:`1.5px solid ${disabled?T.border:T.border}`, borderRadius:14, color: disabled?T.muted:T.text, fontSize:'.9rem', outline:'none', fontWeight: 500, transition:'all .2s' }}
      onFocus={e=>{ if(!disabled){e.target.style.borderColor=T.primary;e.target.style.boxShadow='0 0 0 4px rgba(30, 64, 185, 0.08)'}}}
      onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow='none'}}/>
  </div>
);

const DashboardProfile = () => {
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
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem 0' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>
      
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '.5rem', color: '#111827' }}>Profile Intelligence</h1>
        <p style={{ color: T.muted, fontSize: '1.1rem', fontWeight: 500 }}>Architect your digital presence within the platform.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
        style={{ background: 'white', border: '1.5px solid var(--cs-border)', borderRadius: 40, padding: '3.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px -15px rgba(0,0,0,0.03)' }}>

        {/* Avatar & info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '1.5px solid var(--cs-border)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 84, height: 84, borderRadius: 28, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', fontWeight: 900, color: 'white', flexShrink: 0, boxShadow: `0 15px 35px rgba(30, 64, 185, 0.2)`, border: '4px solid white' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {user?.isVerified && (
               <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#10b981', color: 'white', padding: '4px', borderRadius: '50%', border: '3px solid white', fontSize: '10px' }}>✓</div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '.35rem', color: '#111827' }}>{user?.name}</div>
            <div style={{ fontSize: '1rem', color: T.muted, marginBottom: '.75rem', fontWeight: 600 }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <span style={{ padding: '.45rem 1.25rem', borderRadius: 99, background: `var(--cs-accent-wellness-light)`, border: `1.5px solid var(--cs-primary)`, color: T.primary, fontSize: '.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                ✦ {user?.role}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: user?.isVerified ? '#10b981' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {user?.isVerified ? '✦ VERIFIED' : '✧ UNVERIFIED'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <BwInput label="Full Designation" id="p-name" name="name" value={form.name} onChange={handleChange} placeholder="First and Last Name" />
            <BwInput label="Identity Identifier" id="p-email" type="email" name="email" value={user?.email} disabled />
            <BwInput label="Platform Branch" id="p-uni" name="university" value={form.university} onChange={handleChange} placeholder="University Name" />
            <BwInput label="Core Role" id="p-role" name="role" value={user?.role} disabled />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem' }}>
            <button type="submit" className="cs-button-primary" disabled={loading} style={{ padding: '1.1rem 3rem', borderRadius: '20px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Synchronizing...' : 'Update Core Identity'}
            </button>
            {saved && (
              <motion.span initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: '1rem', color: T.success, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                ✓ Identity Synchronized
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DashboardProfile;
