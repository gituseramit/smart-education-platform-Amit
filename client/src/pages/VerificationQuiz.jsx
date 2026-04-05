import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const T = { 
  primary: 'var(--cs-primary)', 
  border: 'var(--cs-border)', 
  text: 'var(--cs-text-main)', 
  muted: 'var(--cs-text-muted)',
  light: 'var(--cs-text-light)',
  success: 'var(--cs-accent-wellness)',
  danger: 'var(--cs-accent-career)',
  gold: '#b45309',
  pink: '#db2777'
};
const PASS_SCORE = 70; 

/* ─── helpers ─── */
const ROLE_CFG = {
  mentor:    { color:T.gold,   icon:'👨‍🏫', name:'Mentor',    expertiseLabel:'Teaching / Mentoring Expertise', expertisePlaceholder:'e.g. Data Structures, System Design...' },
  counselor: { color:T.pink,   icon:'🧠',  name:'Counsellor', expertiseLabel:'Counselling Specialisation',       expertisePlaceholder:'e.g. Anxiety, Academic Stress...' },
};

/* ─── Step indicator ─── */
const Step = ({ n, label, active, done, color }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', opacity: done||active?1:.35 }}>
    <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'.8rem', flexShrink:0, background: done?color:active?`${color}15`:'white', border:`1.5px solid ${done||active?color:T.border}`, color: done?'white':color }}>
      {done?'✓':n}
    </div>
    <span style={{ fontSize:'.75rem', fontWeight:700, color: active?'#111827':T.muted, whiteSpace:'nowrap' }}>{label}</span>
  </div>
);

/* ─── Main Component ─── */
const VerificationQuiz = () => {
  const { user, updateVerification } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'mentor';
  const cfg  = ROLE_CFG[role] || ROLE_CFG.mentor;

  // ── Phase state ──
  const [phase, setPhase]         = useState('intro');      
  const [expertise, setExpertise] = useState(user?.expertise||'');
  const [questions, setQuestions] = useState([]);           
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);         
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers]     = useState([]);           
  const [score, setScore]         = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]         = useState('');
  const textareaRef = useRef(null);

  const needs = ['mentor','counselor'];
  if (!needs.includes(role)) { navigate('/dashboard',{replace:true}); return null; }

  /* ── Robust JSON cleaner for AI output ── */
  const cleanAndParseJSON = (raw) => {
    // 1. Strip markdown code fences  ```json ... ```
    let text = raw.replace(/```(?:json)?[\r\n]*([\sS]*?)```/gi, '$1').trim();

    // 2. Extract the outermost { ... } block
    const start = text.indexOf('{');
    const end   = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON object found.');
    text = text.slice(start, end + 1);

    // 3. Remove trailing commas before ] or } — common AI mistake
    text = text.replace(/,\s*([\]}])/g, '$1');

    // 4. Fix literal newlines/tabs inside string values (walk char-by-char)
    let inString = false, escaped = false, result = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (escaped) { result += ch; escaped = false; continue; }
      if (ch === '\\') { escaped = true; result += ch; continue; }
      if (ch === '"') { inString = !inString; result += ch; continue; }
      if (inString && ch === '\n') { result += '\\n'; continue; }
      result += ch;
    }
    return JSON.parse(result);
  };

  /* ── Generate 20 MCQ questions from AI, with fallback ── */
  const generateQuestions = async () => {
    if (!expertise.trim()) { setError('Describe your expertise first.'); return; }
    setError('');
    setIsGenerating(true);

    try {
      const p = `Generate 20 MCQ questions for a ${cfg.name} test on "${expertise}". JSON ONLY: {"questions":[{"q":"Q","options":["A","B","C","D"],"correct":0,"explanation":"E"}]}`;
      const res = await api.post('/ai/chat', { message: p, history: [] });
      const parsed = cleanAndParseJSON(res.data.response || '');
      if (parsed?.questions?.length >= 5) setQuestions(parsed.questions.slice(0,20));
      else throw new Error('Short');
    } catch (e) {
      setQuestions([...Array(20)].map(()=>({ q:'Professional ethics question?', options:['A','B','C','D'], correct:1, explanation:'Ethics are crucial.' })));
    }
    setPhase('quiz');
    setIsGenerating(false);
  };

  /* ── Confirm answer ── */
  const confirmAnswer = () => {
    if (selected === null) return;
    setAnswers(prev => [...prev, { correct: selected === questions[current].correct }]);
    setConfirmed(true);
  };

  /* ── Next question / finish ── */
  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c+1);
      setSelected(null);
      setConfirmed(false);
    } else {
      const correctCount = [...answers, { correct: selected === questions[current].correct }].filter(a => a.correct).length;
      const pct = Math.round((correctCount / questions.length) * 100);
      setScore(pct);
      setPhase('result');
      saveVerification(pct >= PASS_SCORE);
    }
  };

  /* ── Save to backend + context ── */
  const saveVerification = async (passed) => {
    try { await api.patch('/auth/verify', { isVerified: passed }); updateVerification?.(passed); }
    catch(e) { updateVerification?.(passed); }
  };

  /* ════════════════════════════════════════════════════════════
     INTRO PHASE
  ════════════════════════════════════════════════════════════ */
  if (phase === 'intro') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', padding:'2rem 1.5rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>
      
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{ width:'100%', maxWidth:580, background:'white', border:'1px solid var(--cs-border)', borderRadius:32, padding:'3.5rem 3rem', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.06)', position:'relative' }}>
        
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'4rem', marginBottom:'1.25rem' }}>{cfg.icon}</div>
          <h2 style={{ fontSize:'1.85rem', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'.6rem', color: '#111827' }}>{cfg.name} Verification</h2>
          <p style={{ color:T.muted, fontSize:'.95rem', fontWeight: 500, lineHeight:1.7 }}>
            Pass our <strong style={{ color:'#111827' }}>AI Intelligence Assessment</strong> to unlock your verified status. You need <strong style={{ color:T.primary }}>{PASS_SCORE}% or above</strong>.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'2rem' }}>
          {[['📋','20 Questions'],['⏱️','Untimed'],['🎯','70% Pass Mark'],['🔄','Unlimited Retries']].map(([e,t])=>(
            <div key={t} style={{ padding:'1rem', borderRadius:18, background:'#f8fafc', border:'1px solid var(--cs-border)', textAlign:'left', display:'flex', alignItems:'center', gap:'.75rem' }}>
              <span style={{ fontSize:'1.4rem' }}>{e}</span>
              <span style={{ fontWeight:700, fontSize:'.85rem', color: '#374151' }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:'2rem' }}>
          <label style={{ display:'block', fontSize:'.85rem', fontWeight:800, color:'#374151', marginBottom:'.6rem' }}>{cfg.expertiseLabel}</label>
          <textarea rows={3} value={expertise} onChange={e=>{setExpertise(e.target.value); setError('');}} placeholder={cfg.expertisePlaceholder}
            style={{ width:'100%', boxSizing:'border-box', padding:'1rem', background:'white', border:`1.5px solid ${error?T.danger:T.border}`, borderRadius:16, color:'#111827', fontSize:'.95rem', outline:'none', resize:'none', fontWeight: 500 }}
            onFocus={e=>{e.target.style.borderColor=T.primary; e.target.style.boxShadow='0 0 0 4px rgba(30, 64, 185, 0.08)';}}
            onBlur={e=>{e.target.style.borderColor=T.border; e.target.style.boxShadow='none';}}/>
          {error && <div style={{ color:T.danger, fontSize:'.82rem', marginTop:'.5rem', fontWeight: 700 }}>⚠ {error}</div>}
        </div>

        <button onClick={generateQuestions} disabled={isGenerating} className="cs-button-primary" style={{ width:'100%', padding:'1.1rem', fontSize:'1rem' }}>
          {isGenerating ? 'AI is generating quiz...' : 'Begin Assessment →'}
        </button>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.9rem', color:T.muted, fontWeight: 500 }}>
          Not ready? <button onClick={()=>navigate('/dashboard')} style={{ background:'none', border:'none', color:T.primary, fontWeight:700, cursor:'pointer' }}>Return to Dashboard</button>
        </p>
      </motion.div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     QUIZ PHASE
  ════════════════════════════════════════════════════════════ */
  if (phase === 'quiz') {
    const q = questions[current];
    const progress = ((current + 1) / questions.length) * 100;
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', padding:'1.5rem' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>

        <motion.div initial={{ opacity:0, scale:.98 }} animate={{ opacity:1, scale:1 }}
          style={{ width:'100%', maxWidth:680, background:'white', border:'1px solid var(--cs-border)', borderRadius:32, overflow:'hidden', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.08)' }}>

          <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid var(--cs-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <span style={{ fontSize:'2rem' }}>{cfg.icon}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:'.95rem', color: '#111827' }}>{cfg.name} Assessment</div>
                <div style={{ fontSize:'.8rem', color:T.muted, fontWeight: 500 }}>{expertise.slice(0,30)}...</div>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight:900, fontSize:'1.25rem', color:T.primary }}>{current+1}<span style={{ color:T.light, fontWeight:500 }}>/{questions.length}</span></div>
            </div>
          </div>

          <div style={{ height:6, background:'#f1f5f9' }}>
            <motion.div animate={{ width:`${progress}%` }} style={{ height:'100%', background:T.primary }}/>
          </div>

          <div style={{ padding:'3rem 2.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <p style={{ fontSize:'1.25rem', fontWeight:800, lineHeight:1.5, marginBottom: '2.5rem', color: '#111827' }}>{q.q}</p>

                <div style={{ display:'flex', flexDirection:'column', gap: '1rem' }}>
                  {q.options.map((opt, idx) => {
                    let bg = 'white', border = `1.5px solid var(--cs-border)`, color = '#374151';
                    if (confirmed) {
                      if (idx === q.correct) { bg='rgba(21, 128, 61, 0.05)'; border='1.5px solid #15803d'; color='#15803d'; }
                      else if (idx === selected) { bg='rgba(185, 28, 28, 0.05)'; border='1.5px solid #b91c1c'; color='#b91c1c'; }
                    } else if (idx === selected) { bg='rgba(30, 64, 185, 0.04)'; border=`1.5px solid ${T.primary}`; color=T.primary; }
                    
                    return (
                      <button key={idx} onClick={()=>{ if(!confirmed) setSelected(idx); }}
                        style={{ width:'100%', padding:'1.25rem 1.5rem', borderRadius:18, border, background:bg, color, textAlign:'left', cursor:confirmed?'default':'pointer', fontSize:'1rem', fontWeight: 600, transition:'all .2s', display:'flex', alignItems:'center', gap:'1rem' }}>
                        <span style={{ width:28, height:28, borderRadius:8, background: idx===selected?T.primary:'#f3f4f6', color: idx===selected?'white':'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', fontWeight:800 }}>{String.fromCharCode(65+idx)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {confirmed && (
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    style={{ marginTop:'2rem', padding:'1.5rem', borderRadius:20, background: selected===q.correct?'#f0fdf4':'#fef2f2', border:'1px solid transparent' }}>
                    <div style={{ fontWeight:800, fontSize:'.9rem', color: selected===q.correct?'#15803d':'#b91c1c', marginBottom:'.4rem' }}>{selected===q.correct?'✓ Correct':'✗ Incorrect'}</div>
                    <div style={{ fontSize:'.95rem', color: '#4b5563', lineHeight:1.6, fontWeight: 500 }}>{q.explanation}</div>
                  </motion.div>
                )}

                <div style={{ marginTop:'2.5rem', display:'flex', justifyContent:'flex-end' }}>
                  {!confirmed ? (
                    <button onClick={confirmAnswer} disabled={selected===null} className="cs-button-primary" style={{ padding: '.85rem 2.5rem' }}>Confirm Choice</button>
                  ) : (
                    <button onClick={nextQuestion} className="cs-button-primary" style={{ padding: '.85rem 2.5rem' }}>{current<questions.length-1?'Next Question →':'Finalize Result'}</button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     RESULT PHASE
  ════════════════════════════════════════════════════════════ */
  const passed = score >= PASS_SCORE;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', padding:'2rem 1.5rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>

      <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
        style={{ width:'100%', maxWidth:580, background:'white', border:'1px solid var(--cs-border)', borderRadius:32, padding:'4rem 3.5rem', textAlign:'center', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.1)' }}>
        
        <div style={{ fontSize:'5rem', marginBottom:'1.5rem' }}>{passed?'🏆':'🛡️'}</div>
        <h2 style={{ fontSize:'2.25rem', fontWeight:900, letterSpacing:'-0.04em', marginBottom:'.75rem', color: passed?'#15803d':'#b91c1c' }}>
          {passed?'Verified Platform Status':'Assessment Incomplete'}
        </h2>

        <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:140, height:140, borderRadius:'50%', background: passed?'#f0fdf4':'#fef2f2', border:`4px solid ${passed?'#15803d':'#b91c1c'}`, margin:'2rem auto', flexDirection:'column' }}>
          <div style={{ fontSize:'2.5rem', fontWeight:900, color: passed?'#15803d':'#b91c1c', lineHeight:1 }}>{score}%</div>
          <div style={{ fontSize:'.85rem', color:T.muted, fontWeight: 700, marginTop: '.2rem' }}>SCORE</div>
        </div>

        <p style={{ color:T.muted, fontSize:'1.05rem', fontWeight: 500, lineHeight:1.75, marginBottom:'2.5rem' }}>
          {passed 
            ? `Excellent work. Your credentials have been verified with a score of ${score}%. You now have full access to our professional features.`
            : `You scored ${score}% — a minimum of ${PASS_SCORE}% is required for verification. Review your expertise area and retake the assessment when ready.`}
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap: '1rem' }}>
          <button onClick={()=>navigate('/dashboard')} className="cs-button-primary" style={{ width:'100%', padding: '1rem' }}>{passed?'Enter Platform':'Back to Dashboard'}</button>
          {!passed && (
            <button onClick={()=>{ setPhase('intro'); setQuestions([]); setCurrent(0); setAnswers([]); setSelected(null); setConfirmed(false); }}
              style={{ padding:'1rem', borderRadius:16, border:`1.5px solid var(--cs-border)`, background:'white', color:'#111827', fontWeight:800, fontSize:'1rem', cursor:'pointer' }}>
              🔄 Retake Assessment
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationQuiz;
