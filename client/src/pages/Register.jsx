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

function BwInput({ id, type='text', name, value, onChange, placeholder, icon, error, autoComplete }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:T.muted, pointerEvents:'none', display: 'flex' }}>{icon}</div>
      <input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        style={{ width:'100%', boxSizing:'border-box', padding:'.85rem 1rem .85rem 2.8rem', background:'white', border:`1.5px solid ${error?T.danger:T.border}`,
          borderRadius:14, color:T.text, fontSize:'.9rem', outline:'none', fontWeight: 500 }}
        onFocus={e=>{e.target.style.borderColor=T.primary;e.target.style.boxShadow='0 0 0 4px rgba(30, 64, 185, 0.08)'}}
        onBlur={e=>{e.target.style.borderColor=error?T.danger:T.border;e.target.style.boxShadow='none'}}/>
    </div>
  );
}

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'student', university:'' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = e => { setForm({...form,[e.target.name]:e.target.value}); if(errors[e.target.name]) setErrors({...errors,[e.target.name]:''}); };

  const validate = () => {
    const e = {};
    if(!form.name.trim()) e.name='Name is required'; else if(form.name.trim().length<2) e.name='Min 2 characters';
    if(!form.email) e.email='Email is required'; else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email';
    if(!form.password) e.password='Password is required'; else if(form.password.length<6) e.password='Min 6 characters'; else if(!/\d/.test(form.password)) e.password='Must contain a number';
    if(!form.confirmPassword) e.confirmPassword='Please confirm password'; else if(form.password!==form.confirmPassword) e.confirmPassword='Passwords do not match';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setServerError('');
    if(!validate()) return;
    setLoading(true);
    try { await register(form.name, form.email, form.password, form.role, form.university); navigate('/dashboard'); }
    catch(err) { setServerError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const roles = [
    { value:'student',   label:'Student',   icon:'🎓' },
    { value:'mentor',    label:'Mentor',    icon:'👨‍🏫' },
    { value:'counselor', label:'Counselor', icon:'🧘' },
  ];

  const IconUser = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const IconMail = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>;
  const IconLock = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
  const IconUni  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M4 20V10l8-6 8 6v10"/></svg>;
  const IconShield = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

  const Err = ({msg}) => msg ? <span style={{ fontSize:'.78rem', color:T.danger, marginTop:'.4rem', display:'block', fontWeight: 600 }}>{msg}</span> : null;
  const Label = ({htmlFor, children}) => <label htmlFor={htmlFor} style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#374151', marginBottom:'.45rem' }}>{children}</label>;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', padding:'2rem 1.5rem', position:'relative', overflow:'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap'); *{font-family:'Outfit',sans-serif!important;} input::placeholder{color:var(--cs-text-light)!important;} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Bg glows */}
      <div style={{ position:'absolute', top: '5%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30, 64, 175, 0.04) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div style={{ position:'absolute', bottom: '5%', right: '5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(133, 141, 255, 0.03) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, ease:[.16,1,.3,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:580, background:'white', border:'1px solid var(--cs-border)', borderRadius:32, padding:'3.5rem 3rem', boxShadow: '0 20px 60px -15px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:56, height:56, borderRadius:16, background:T.primary, color: 'white', fontSize:'1.6rem', marginBottom:'1.25rem', boxShadow: '0 8px 20px rgba(30, 64, 185, 0.2)' }}>✦</div>
          <h2 style={{ fontSize:'1.85rem', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'.5rem', color: '#111827' }}>Create your account</h2>
          <p style={{ color:T.muted, fontSize:'.95rem', fontWeight: 500 }}>Join the ecosystem of elite learners</p>
        </div>

        {serverError && (
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.9rem 1.1rem', borderRadius:14, background:'var(--cs-accent-career-light)', border:'1px solid var(--cs-accent-career)', color: 'var(--cs-accent-career)', fontSize:'.88rem', marginBottom:'1.5rem', fontWeight: 600 }}>
            ⚠ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.15rem' }} noValidate>
          {/* Name + Email */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <div>
              <Label htmlFor="reg-name">Full Name</Label>
              <BwInput id="reg-name" name="name" value={form.name} onChange={handle} placeholder="Guardian Name" icon={IconUser} error={errors.name} autoComplete="name"/>
              <Err msg={errors.name}/>
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <BwInput id="reg-email" type="email" name="email" value={form.email} onChange={handle} placeholder="you@uni.edu" icon={IconMail} error={errors.email} autoComplete="email"/>
              <Err msg={errors.email}/>
            </div>
          </div>

          {/* Passwords */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <div>
              <Label htmlFor="reg-pw">Password</Label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:T.muted, display: 'flex' }}>{IconLock}</div>
                <input id="reg-pw" type={showPw?'text':'password'} name="password" value={form.password} onChange={handle} placeholder="••••••••" autoComplete="new-password"
                  style={{ width:'100%', boxSizing:'border-box', padding:'.85rem 2.8rem .85rem 2.8rem', background:'white', border:`1.5px solid ${errors.password?T.danger:T.border}`, borderRadius:14, color:T.text, fontSize:'.9rem', outline:'none', fontWeight: 500 }}
                  onFocus={e=>{e.target.style.borderColor=T.primary;e.target.style.boxShadow='0 0 0 4px rgba(30, 64, 185, 0.08)'}}
                  onBlur={e=>{e.target.style.borderColor=errors.password?T.danger:T.border;e.target.style.boxShadow='none'}}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:'.9rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:T.muted, cursor:'pointer', fontSize:'1.1rem', padding: 0 }}>{showPw?'🙈':'👁'}</button>
              </div>
              <Err msg={errors.password}/>
            </div>
            <div>
              <Label htmlFor="reg-confirm">Confirm</Label>
              <BwInput id="reg-confirm" type={showPw?'text':'password'} name="confirmPassword" value={form.confirmPassword} onChange={handle} placeholder="••••••••" icon={IconShield} error={errors.confirmPassword} autoComplete="new-password"/>
              <Err msg={errors.confirmPassword}/>
            </div>
          </div>

          {/* University */}
          <div>
            <Label htmlFor="reg-uni">University <span style={{ color:T.muted, fontWeight:500 }}>(optional)</span></Label>
            <BwInput id="reg-uni" name="university" value={form.university} onChange={handle} placeholder="e.g. IIT Delhi, BITS Pilani..." icon={IconUni}/>
          </div>

          {/* Role picker */}
          <div>
            <Label>Joining as a...</Label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
              {roles.map(r => (
                <label key={r.value} style={{ position:'relative', cursor:'pointer' }}>
                  <input type="radio" name="role" value={r.value} checked={form.role===r.value} onChange={handle} style={{ position:'absolute', opacity:0, width:0, height:0 }}/>
                  <div style={{ padding:'1rem .75rem', borderRadius:18, border:`2px solid ${form.role===r.value?T.primary:T.border}`, background: form.role===r.value?'var(--cs-accent-wellness-light)':'white', textAlign:'center', transition:'all .25s',
                    boxShadow: form.role===r.value?'0 8px 20px -5px rgba(30, 64, 185, 0.15)':'none' }}>
                    <div style={{ fontSize:'1.5rem', marginBottom:'.4rem' }}>{r.icon}</div>
                    <div style={{ fontSize:'.85rem', fontWeight:800, color: form.role===r.value?T.primary:T.muted }}>{r.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="cs-button-primary"
            style={{ marginTop:'.75rem', padding:'.95rem', borderRadius:14, cursor:loading?'not-allowed':'pointer', fontSize: '1.05rem' }}>
            {loading ? <span style={{ display:'inline-block', width:22, height:22, border:'2.5px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.6s linear infinite' }}/> : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.8rem', fontSize:'.95rem', color:T.muted, fontWeight: 500 }}>
          Already part of the network?{' '}
          <Link to="/login" style={{ color:T.primary, fontWeight:700, textDecoration:'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
