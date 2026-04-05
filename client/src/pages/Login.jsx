import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const T = { 
  primary: 'var(--cs-primary)', 
  border: 'var(--cs-border)', 
  text: 'var(--cs-text-main)', 
  muted: 'var(--cs-text-muted)',
  light: 'var(--cs-text-light)',
  danger: 'var(--cs-accent-career)' 
};

function BwInput({ id, type='text', name, value, onChange, placeholder, icon, error, rightEl, autoComplete }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:T.muted, pointerEvents:'none', display: 'flex' }}>{icon}</div>
      <input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        style={{ width:'100%', padding:'.85rem 1rem .85rem 2.8rem', background:'white', border:`1.5px solid ${error?T.danger:T.border}`,
          borderRadius:14, color:T.text, fontSize:'.9rem', outline:'none', boxSizing:'border-box', paddingRight: rightEl?'3rem':'1rem', fontWeight: 500 }}
        onFocus={e=>{e.target.style.borderColor=T.primary;e.target.style.boxShadow='0 0 0 4px rgba(30, 64, 185, 0.08)'}}
        onBlur={e=>{e.target.style.borderColor=error?T.danger:T.border;e.target.style.boxShadow='none'}}/>
      {rightEl && <div style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>}
    </div>
  );
}

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => { setForm({...form,[e.target.name]:e.target.value}); if(errors[e.target.name]) setErrors({...errors,[e.target.name]:''}); };

  const validate = () => {
    const e = {};
    if(!form.email) e.email='Email is required';
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email';
    if(!form.password) e.password='Password is required';
    else if(form.password.length<6) e.password='Min 6 characters';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setServerError('');
    if(!validate()) return;
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch(err) { setServerError(err.response?.data?.message || 'Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', padding:'2rem 1.5rem', position:'relative', overflow:'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>

      {/* Subtle background glow */}
      <div style={{ position:'absolute', top: '10%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30, 64, 185, 0.03) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div style={{ position:'absolute', bottom: '10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(133, 141, 255, 0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, ease:[.16,1,.3,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440, background:'white', border:'1px solid var(--cs-border)', borderRadius:32, padding:'3.5rem 3rem', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.06)' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:56, height:56, borderRadius:16, background:T.primary, color: 'white', fontSize:'1.6rem', marginBottom:'1.25rem', boxShadow: '0 8px 20px rgba(30, 64, 185, 0.2)' }}>✦</div>
          <h2 style={{ fontSize:'1.85rem', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'.5rem', color: '#111827' }}>Welcome back</h2>
          <p style={{ color:T.muted, fontSize:'.95rem', fontWeight: 500 }}>Step into your private study space</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.9rem 1.1rem', borderRadius:14, background:'var(--cs-accent-career-light)', border:'1px solid var(--cs-accent-career)', color: 'var(--cs-accent-career)', fontSize:'.88rem', marginBottom:'1.5rem', fontWeight: 600 }}>
            ⚠ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }} noValidate>
          <div>
            <label htmlFor="login-email" style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#374151', marginBottom:'.5rem' }}>Email Address</label>
            <BwInput id="login-email" type="email" name="email" value={form.email} onChange={handle} placeholder="your@email.com"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>}
              error={errors.email} autoComplete="email"/>
            {errors.email && <span style={{ fontSize:'.78rem', color:T.danger, marginTop:'.4rem', display:'block', fontWeight: 600 }}>{errors.email}</span>}
          </div>

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.5rem' }}>
              <label htmlFor="login-pw" style={{ fontSize:'.85rem', fontWeight:700, color:'#374151' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize:'.82rem', color:T.primary, textDecoration:'none', fontWeight: 700 }}>Recovery</Link>
            </div>
            <BwInput id="login-pw" type={showPw?'text':'password'} name="password" value={form.password} onChange={handle} placeholder="••••••••"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
              error={errors.password} autoComplete="current-password"
              rightEl={<button type="button" onClick={()=>setShowPw(!showPw)} style={{ background:'none', border:'none', color:T.muted, cursor:'pointer', padding:0, fontSize: '1.1rem' }}>{showPw?'🙈':'👁'}</button>}/>
            {errors.password && <span style={{ fontSize:'.78rem', color:T.danger, marginTop:'.4rem', display:'block', fontWeight: 600 }}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} className="cs-button-primary"
            style={{ marginTop:'.75rem', padding:'.95rem', borderRadius:14, cursor: loading?'not-allowed':'pointer', fontSize: '1rem' }}>
            {loading ? <span style={{ display:'inline-block', width:20, height:20, border:'2.5px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/> : 'Enter Platform →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.8rem', fontSize:'.9rem', color:T.muted, fontWeight: 500 }}>
          New to the community?{' '}
          <Link to="/register" style={{ color:T.primary, fontWeight:700, textDecoration:'none' }}>Join free</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Login;
