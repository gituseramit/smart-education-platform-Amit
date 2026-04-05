import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════
   BRAINWAVE PALETTE
   #AC6AFF purple  #FFC876 gold  #FF776F coral
   #7ADB78 lime    #858DFF blue  #FF98E2 pink
═══════════════════════════════════════════════════════════════════════ */
const P = {
  primary: 'var(--cs-primary)',
  accent: 'var(--cs-accent-wellness)',
  muted: 'var(--cs-text-light)',
  bg: '#f8fafc',
  white: '#ffffff',
};

/* ── Global CSS injected once ─────────────────────────────────────── */
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
html { scroll-behavior: smooth; }
body { font-family: 'Outfit', sans-serif !important; background: #f8fafc !important; color: #111827 !important; }

.god-ray-l {
  position: fixed; top: -10%; left: 18%; width: 2px; height: 130vh; pointer-events: none; z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(30, 64, 175, 0.05) 35%, rgba(133, 141, 255, 0.08) 65%, transparent 100%);
  transform: rotate(-14deg); filter: blur(3px);
  animation: grl 12s ease-in-out infinite alternate;
}
.god-ray-r {
  position: fixed; top: -10%; right: 22%; width: 1px; height: 130vh; pointer-events: none; z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(21, 128, 61, 0.03) 40%, rgba(133, 141, 255, 0.05) 70%, transparent 100%);
  transform: rotate(11deg); filter: blur(5px);
  animation: grl 15s ease-in-out 3s infinite alternate;
}
@keyframes grl {
  from { opacity: .4; transform: rotate(-14deg) scaleX(1); }
  to   { opacity: .7; transform: rotate(-11deg) scaleX(2); }
}
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
  content: ''; position: absolute; top: -50%; left: -60%; width: 33%; height: 200%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
  transform: skewX(-25deg); transition: left 0.7s;
}
.btn-shine:hover::after { left: 178%; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   THREE.JS ORB (brainwave conic ring style)
═══════════════════════════════════════════════════════════════════════ */
function CosmicOrb() {
  const ref = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4;
    const geo = new THREE.SphereGeometry(1.2, 64, 64);
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(P.bg), metalness: .9, roughness: .1, emissive: new THREE.Color(P.purple), emissiveIntensity: .12 });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);
    scene.add(new THREE.Mesh(geo.clone(), new THREE.MeshBasicMaterial({ color: P.purple, wireframe: true, transparent: true, opacity: .07 })));
    const mkR = (r, col, op, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, .01, 4, 200), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op }));
      m.rotation.set(rx, ry, rz); scene.add(m); return m;
    };
    const r1 = mkR(1.65, P.purple, .6, Math.PI/3);
    const r2 = mkR(1.9, P.coral, .4, Math.PI/6, Math.PI/5);
    const r3 = mkR(2.1, P.blue,  .3, 0, 0, Math.PI/4);
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) { const r = 2.4 + Math.random()*1.5, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1); pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pos[i*3+2]=r*Math.cos(ph); }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: P.gold, size: .04, transparent: true, opacity: .7 }));
    scene.add(pts);
    scene.add(new THREE.AmbientLight('#fff', .4));
    const pL = new THREE.PointLight(P.purple, 4, 12); pL.position.set(3,2,2); scene.add(pL);
    const cL = new THREE.PointLight(P.coral, 3, 12); cL.position.set(-3,-2,1); scene.add(cL);
    const onMM = e => { const rc = el.getBoundingClientRect(); mouse.current.x = ((e.clientX-rc.left)/W-.5)*2; mouse.current.y = -((e.clientY-rc.top)/H-.5)*2; };
    el.addEventListener('mousemove', onMM);
    let t = 0, raf;
    const loop = () => { raf = requestAnimationFrame(loop); t += .008;
      sphere.rotation.y += .003; sphere.rotation.z += .001;
      sphere.position.x += (mouse.current.x*.25 - sphere.position.x)*.05;
      sphere.position.y += (mouse.current.y*.2 + Math.sin(t*.7)*.06 - sphere.position.y)*.05;
      r1.rotation.z += .004; r2.rotation.y += .003; r3.rotation.x += .002; r3.rotation.y -= .003; pts.rotation.y += .001;
      mat.emissiveIntensity = .3 + Math.sin(t*1.5)*.1; pL.intensity = 2 + Math.sin(t*2);
      renderer.render(scene, camera);
    };
    loop();
    return () => { cancelAnimationFrame(raf); el.removeEventListener('mousemove', onMM); renderer.dispose(); if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);
  return <div ref={ref} style={{ width:'100%', height:'100%' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════
   STARFIELD CANVAS
═══════════════════════════════════════════════════════════════════════ */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const cvs = ref.current; if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let W = innerWidth, H = innerHeight; cvs.width = W; cvs.height = H;
    const COLS = [`rgba(172,106,255,`, `rgba(133,141,255,`, `rgba(255,119,111,`, `rgba(255,200,118,`, `rgba(122,219,120,`, `rgba(255,152,226,`];
    const stars = Array.from({ length: 220 }, () => ({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.14, vy:(Math.random()-.5)*.14, r:Math.random()*1.5+.3, a:Math.random()*.5+.15, ad:Math.random()>.5?1:-1, col:COLS[Math.floor(Math.random()*COLS.length)] }));
    let sy = 0, raf;
    const draw = () => { ctx.clearRect(0,0,W,H); const off = sy*.03;
      for (const s of stars) { s.x+=s.vx; s.y+=s.vy; s.a+=s.ad*.003; if(s.a<.05||s.a>.8)s.ad*=-1; if(s.x<0)s.x=W; if(s.x>W)s.x=0; if(s.y<0)s.y=H; if(s.y>H)s.y=0; ctx.beginPath(); ctx.arc(s.x,s.y-off,s.r,0,Math.PI*2); ctx.fillStyle=s.col+s.a+')'; ctx.fill(); }
      for (let i=0;i<stars.length;i++) for (let j=i+1;j<stars.length;j++) { const dx=stars[i].x-stars[j].x, dy=(stars[i].y-off)-(stars[j].y-off), d=Math.sqrt(dx*dx+dy*dy); if(d<92){ctx.beginPath();ctx.moveTo(stars[i].x,stars[i].y-off);ctx.lineTo(stars[j].x,stars[j].y-off);ctx.strokeStyle='rgba(172,106,255,'+(1-d/92)*.09+')';ctx.lineWidth=.4;ctx.stroke()} }
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener('scroll', () => { sy = scrollY; }, { passive:true });
    window.addEventListener('resize', () => { W=innerWidth; H=innerHeight; cvs.width=W; cvs.height=H; });
    draw();
    return () => { cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════
   CURSOR TRAIL
═══════════════════════════════════════════════════════════════════════ */
function CursorTrail() {
  const [dots, setDots] = useState([]);
  const id = useRef(0);
  useEffect(() => {
    const fn = e => { const cur = id.current++; setDots(p => [...p.slice(-14), { id:cur, x:e.clientX, y:e.clientY }]); setTimeout(() => setDots(p => p.filter(d => d.id !== cur)), 550); };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }}>
      {dots.map(d => <motion.div key={d.id} initial={{ opacity:.6, scale:1 }} animate={{ opacity:0, scale:0 }} transition={{ duration:.5 }}
        style={{ position:'absolute', left:d.x-6, top:d.y-6, width:12, height:12, borderRadius:'50%', background:P.purple, boxShadow:`0 0 14px ${P.purple}` }} />)}
    </div>
  );
}

/* ── Scroll Reveal ─────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity:0, y:55, scale:.97, filter:'blur(7px)' }}
      whileInView={{ opacity:1, y:0, scale:1, filter:'blur(0px)' }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.95, delay, ease:[.16,1,.3,1] }}>
      {children}
    </motion.div>
  );
}

/* ── Magnetic Button ───────────────────────────────────────────────── */
function MagBtn({ to, children, primary }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x:0, y:0 });
  return (
    <motion.div ref={ref} animate={{ x:pos.x, y:pos.y }} transition={{ type:'spring', stiffness:420, damping:26 }}
      onMouseMove={e => { const r=ref.current.getBoundingClientRect(); setPos({ x:(e.clientX-r.left-r.width/2)*.3, y:(e.clientY-r.top-r.height/2)*.3 }); }}
      onMouseLeave={() => setPos({ x:0, y:0 })}>
      <Link to={to} className="btn-shine" style={primary ? {
        display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'1rem 2.4rem', borderRadius:999, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'1rem', textDecoration:'none', color:'#fff',
        background:`linear-gradient(135deg,${P.purple},#C795FF)`, boxShadow:`0 0 38px rgba(172,106,255,0.32),inset 0 1px 0 rgba(255,255,255,0.14)`, transition:'transform .3s,box-shadow .3s',
      } : {
        display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'1rem 2.4rem', borderRadius:999, fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'1rem', textDecoration:'none',
        color:'rgba(255,255,255,0.82)', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(12px)',
      }}>
        {children}
      </Link>
    </motion.div>
  );
}

/* ── Tilt Card ─────────────────────────────────────────────────────── */
function TiltCard({ children, style, className = '' }) {
  const ref = useRef(null);
  return (
    <div ref={ref} className={`scanl ${className}`}
      onMouseMove={e => { const r=ref.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5; ref.current.style.transform=`perspective(900px) rotateY(${x*9}deg) rotateX(${-y*7}deg) translateY(-8px) scale(1.02)`; }}
      onMouseLeave={() => { ref.current.style.transform = ''; }}
      style={{ transition:'transform .4s cubic-bezier(.25,.46,.45,.94),box-shadow .4s,border-color .4s', cursor:'default', ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0,600], [0,-100]);
  const heroOp = useTransform(scrollY, [0,400], [1,0]);
  const springY = useSpring(heroY, { stiffness:80, damping:20 });

  const benefits = [
    { icon:'🧠', title:'Concept Explainer',    desc:'Breaks down any lecture or textbook chapter into simple language with real-world analogies that actually stick.', col:P.purple,  glow:'rgba(172,106,255,' },
    { icon:'🔢', title:'Step-by-Step Solver',  desc:'Walks through problems — maths, code, essays, case studies — one clear step at a time with full reasoning shown.',  col:P.blue,    glow:'rgba(133,141,255,' },
    { icon:'💬', title:'Instant Q&A',          desc:'Ask anything, anytime — from a specific exam question to "why do I even need this?" — and get an answer instantly.',  col:P.coral,   glow:'rgba(255,119,111,' },
    { icon:'📊', title:'Progress Dashboard',   desc:'See your academic condition, topic mastery, quiz scores, and weekly growth — all visualised in real time.',           col:P.gold,    glow:'rgba(255,200,118,' },
    { icon:'🏫', title:'Live Chat Classroom',  desc:'Study with friends in real-time chat rooms, share notes, ask the group, and solve problems together.',                col:P.lime,    glow:'rgba(122,219,120,' },
    { icon:'🎯', title:'Instant Quizzes',      desc:'Test yourself on any topic with AI-generated quizzes, get instant scored results, and see exactly what to improve.',   col:P.pink,    glow:'rgba(255,152,226,' },
  ];

  const services = [
    { n:'01', title:'AI Mentoring & Counselling', desc:'Personal mentoring from AI and real senior students — career advice, life decisions, academic planning, and emotional support. Available 24/7.',   col:P.purple },
    { n:'02', title:'Internship Suite',            desc:"AI guides your entire internship hunt — CV writing, cover letters, mock interviews, and curated job matches based on your skills and goals.",       col:P.blue   },
    { n:'03', title:'Live Video with Mentors',     desc:'Schedule or drop into live 1:1 or group video calls with seniors, faculty mentors, or friends — your virtual study room, always open.',            col:P.coral  },
    { n:'04', title:'Deep Topic Exploration',      desc:'Go beyond the syllabus — ask your AI to take any concept as deep as you want, from beginner basics to advanced research-level insights.',          col:P.gold   },
    { n:'05', title:'Group Study Rooms',           desc:'Create or join real-time study rooms with classmates — share screens, pin notes, drop resources, and learn together in perfect sync.',              col:P.lime   },
    { n:'06', title:'Personal Life Coach',         desc:'Beyond academics — your AI helps with time management, goal tracking, mental wellness check-ins, and professional habit building.',                  col:P.pink   },
  ];

  const testimonials = [
    { q:'"The concept explainer got me through Thermodynamics in 3 days. I\'d been stuck for weeks. It used a cooking analogy and suddenly it all clicked. Best tool I\'ve used."', name:'Rohan Mehra',   role:'Mech. Eng., NIT Trichy',    init:'R', gc:[P.purple,P.blue],   rot:-1.5 },
    { q:'"Got my internship at Razorpay after the AI mock interview and CV builder. The feedback was shockingly accurate — better than most coaching institutes."',                 name:'Sneha Iyer',    role:'CS, BITS Pilani',           init:'S', gc:[P.blue,P.lime],     rot:1    },
    { q:'"The live study rooms are my entire academic existence now. We do Pomodoro sessions, quiz each other, share notes — it feels like a real campus library but online."',    name:'Aayush Sharma', role:'MBA, IIM Bangalore',         init:'A', gc:[P.coral,P.gold],   rot:-.8  },
    { q:'"At 2 AM during finals, I was breaking down. The AI counsellor listened and helped me refocus. I didn\'t expect it to feel that real. Life-saver."',                     name:'Priya Nair',    role:'Psychology, Delhi Univ.',   init:'P', gc:[P.pink,P.purple],   rot:1.2  },
  ];

  // grid positions for overlapping testimonial layout
  const tGrid = [
    { gridColumn:'1', gridRow:'1 / span 2' },
    { gridColumn:'2', gridRow:'1' },
    { gridColumn:'3', gridRow:'1 / span 2' },
    { gridColumn:'2', gridRow:'2' },
  ];

  return (
    <div style={{ background:P.bg, minHeight:'100vh', overflowX:'hidden', fontFamily:"'Sora',sans-serif", color:'#fff' }}>
      <style>{GCSS}</style>
      <StarField />
      <div className="god-ray-l" />
      <div className="god-ray-r" />
      <CursorTrail />

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <motion.nav initial={{ y:-64, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.7, ease:[.16,1,.3,1] }}
        style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'1.15rem 2.8rem', backdropFilter:'blur(24px)', background:'rgba(255,255,255,0.85)', borderBottom:'1px solid var(--cs-border)' }}>
        <div style={{ fontWeight:800, fontSize:'1.4rem', letterSpacing:'-0.03em', color: 'var(--cs-primary)' }}>
          Smart Education Platform
        </div>
        <div className="hidden md:flex" style={{ gap:'2.5rem' }}>
          {['Features','Services','Students'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color:'var(--cs-text-light)', textDecoration:'none', fontSize:'.875rem', fontWeight:600, transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='var(--cs-primary)'} onMouseLeave={e=>e.target.style.color='var(--cs-text-light)'}>{l}</a>
          ))}
        </div>
        <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
          <Link to="/login" style={{ color:'var(--cs-text-main)', fontSize:'.875rem', fontWeight:700, textDecoration:'none' }}>Sign In</Link>
          <Link to="/register" className="cs-button-primary btn-shine"
            style={{ padding:'.65rem 1.6rem', fontSize:'.875rem' }}>
            Get Started →
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:120, zIndex:2, overflow:'hidden',
        background:`radial-gradient(ellipse 90% 60% at 50% -10%,rgba(30, 64, 175, 0.08) 0%,transparent 70%)` }}>

        {/* Three.js Orb */}
        <motion.div style={{ y:springY, position:'relative', zIndex:10, width:380, height:380, marginBottom:-40 }}>
          <CosmicOrb />
        </motion.div>

        {/* Hero copy */}
        <motion.div style={{ y:heroY, opacity:heroOp, position:'relative', zIndex:10, textAlign:'center', maxWidth:1100, padding:'0 1.5rem' }}>
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.8,delay:.2 }}
            style={{ display:'inline-flex', alignItems:'center', gap:'.55rem', marginBottom:'1.6rem', padding:'.5rem 1.25rem', borderRadius:999,
              border:`1px solid var(--cs-primary)`, background:'var(--cs-accent-wellness-light)',
              color:'var(--cs-primary)', fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em' }}>
            <span style={{ width:8,height:8,borderRadius:'50%',background:'var(--cs-primary)' }} />
            The Future of Learning · Built for your growth
          </motion.div>

          <motion.h1 initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }} transition={{ duration:1,delay:.3 }}
            style={{ fontSize:'clamp(3.5rem,8vw,7.5rem)', fontWeight:900, lineHeight:0.95, letterSpacing:'-0.04em', marginBottom:'1.5rem', color: '#111827' }}>
            A Private<br/>
            <span style={{ color: 'var(--cs-primary)' }}>
              Education
            </span>
            <br/>
            <span style={{ color: 'var(--cs-text-light)' }}>
              For Peak Intelligence
            </span>
          </motion.h1>

          <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.9,delay:.65 }}
            style={{ color:'var(--cs-text-light)', fontSize:'1.2rem', fontWeight: 500, lineHeight:1.7, maxWidth:650, margin:'0 auto 2.5rem' }}>
            Study smarter with AI that understands you. Join a premium platform built for academic excellence and emotional well-being.
          </motion.p>

          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:.9,delay:.85 }}
            style={{ display:'flex', gap:'1.25rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="cs-button-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Enter the Platform →</button>
            <button className="cs-button-muted" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Learn More</button>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
            style={{ marginTop:'4rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'.4rem', color:'var(--cs-text-muted)', fontSize:'.7rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.15em' }}>
            <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:2, ease:'easeInOut' }}>↓</motion.div>
            Scroll to discover
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <section style={{ position:'relative', zIndex:2, padding:'2rem 1.5rem' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Reveal>
            <div style={{ background:'white', border:'1px solid var(--cs-border)', borderRadius:32, padding:'3.5rem',
              display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2rem', textAlign:'center', boxShadow:'0 10px 40px -10px rgba(0,0,0,0.05)' }}>
              {[['500K+','Active Thinkers','var(--cs-primary)'],['50+','Institutions','var(--cs-primary)'],['99%','Growth Score','#15803d'],['4.9/5','User Rating','#b45309']].map(([v,l,c])=>(
                <div key={l}>
                  <div style={{ fontSize:'2.8rem', fontWeight:900, color:c, letterSpacing:'-0.03em', lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:'.8rem', color:'var(--cs-text-light)', fontWeight: 700, textTransform:'uppercase', letterSpacing:'.1em', marginTop:'.75rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BENEFITS GRID ─────────────────────────────────────────── */}
      <section id="features" style={{ position:'relative', zIndex:2, padding:'6rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:'4.5rem' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.4rem 1.1rem', borderRadius:999, border:`1px solid var(--cs-primary)`, background:'var(--cs-accent-wellness-light)', color:'var(--cs-primary)', fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'1.5rem' }}>✦ Core Capabilities</div>
              <h2 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:900, letterSpacing:'-0.03em', lineHeight:1, color: '#111827' }}>
                A Complete Architecture for{' '}
                <span style={{ color: 'var(--cs-primary)' }}>Human Growth.</span>
              </h2>
              <p style={{ color:'var(--cs-text-light)', maxWidth:550, margin:'1rem auto 0', fontSize: '1.1rem', fontWeight: 500, lineHeight:1.7 }}>From academic excellence to mental clarity — every tool is designed for your long-term success.</p>
            </div>
          </Reveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(285px,1fr))', gap:'2rem' }}>
            {benefits.map((b,i) => (
              <Reveal key={b.title} delay={i*.08}>
                <div style={{ background: 'white', border: '1.5px solid var(--cs-border)', borderRadius: 24, padding: '2.5rem', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)', transition: 'transform 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px -5px rgba(0,0,0,0.03)'; }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1.5rem' }}>{b.icon}</div>
                  <div style={{ fontWeight:800, fontSize:'1.2rem', marginBottom:'.6rem', color: '#111827' }}>{b.title}</div>
                  <div style={{ fontSize:'.95rem', color:'var(--cs-text-light)', fontWeight: 500, lineHeight:1.7 }}>{b.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORBITAL BRAIN VISUAL ──────────────────────────────────── */}
      <section style={{ position:'relative', zIndex:2, padding:'6rem 1.5rem', textAlign:'center', background:`radial-gradient(circle at center, rgba(30, 64, 175, 0.03) 0%, transparent 70%)` }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.4rem 1.1rem', borderRadius:999, border:`1px solid var(--cs-primary)`, background:'var(--cs-accent-wellness-light)', color:'var(--cs-primary)', fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'1.5rem' }}>⬡ The Intelligence Network</div>
            <h2 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:900, letterSpacing:'-0.03em', lineHeight:1, color: '#111827' }}>
              One Core Intelligence.{' '}
              <span style={{ color: 'var(--cs-primary)' }}>Infinite Growth Paths.</span>
            </h2>
            <p style={{ color:'var(--cs-text-light)', maxWidth:550, margin:'1rem auto 0', fontSize: '1.1rem', fontWeight: 500, lineHeight:1.7 }}>Connect with AI Guardians, professional mentors, and a community of active thinkers — all synced to your personal goals.</p>
          </Reveal>

          {/* Orbital diagram */}
          <Reveal delay={.2}>
            <div style={{ position:'relative', width:420, height:420, margin:'5rem auto' }}>
              <motion.div animate={{ rotate:360 }} transition={{ duration:25, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:0, borderRadius:'50%', background:`conic-gradient(from 0deg, var(--cs-primary), var(--cs-accent-wellness), var(--cs-accent-career), var(--cs-primary))`, opacity: 0.1, filter: 'blur(10px)' }} />
              <div style={{ position:'absolute', inset:20, borderRadius:'50%', background:'white', border: '2px solid var(--cs-border)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'.5rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '4rem' }}>🧠</span>
                <span style={{ fontWeight:800, fontSize:'1.1rem', color: '#111827' }}>Guardian AI</span>
              </div>
              {[[35,`rgba(30,64,175,0.1)`,1],[60,`rgba(133,141,255,0.08)`,1],[90,`rgba(133,141,255,0.05)`,-1]].map(([gap,c,dir],i)=>(
                <motion.div key={i} animate={{ rotate: dir===1?360:-360 }} transition={{ duration:30+i*20, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', inset:-gap, borderRadius:'50%', border:`1.5px dashed ${c}` }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────── */}
      <section id="services" style={{ position:'relative', zIndex:2, padding:'6rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ marginBottom:'4rem' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.4rem 1.1rem', borderRadius:999, border:`1px solid #15803d`, background:'rgba(21, 128, 61, 0.05)', color:'#15803d', fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'1.5rem' }}>✦ Premium Ecosystem</div>
              <h2 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:900, letterSpacing:'-0.03em', lineHeight:1, color: '#111827' }}>
                Beyond Basic AI.<br/>
                <span style={{ color: 'var(--cs-primary)' }}>True Human Mentoring.</span>
              </h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))', gap:'2rem' }}>
            {services.map((s,i) => (
              <Reveal key={s.n} delay={i*.08}>
                <div style={{ background: 'white', border: '1.5px solid var(--cs-border)', borderRadius: 28, padding: '3rem', position:'relative', overflow:'hidden', boxShadow: '0 4px 25px -10px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize:'.75rem', fontWeight:900, letterSpacing:'.15em', color:'var(--cs-text-muted)', textTransform:'uppercase', marginBottom: '1.25rem' }}>Phase {s.n}</div>
                  <div style={{ fontWeight:800, fontSize:'1.4rem', marginBottom:'.8rem', color: '#111827' }}>{s.title}</div>
                  <div style={{ fontSize:'.95rem', color:'var(--cs-text-light)', fontWeight: 500, lineHeight:1.8 }}>{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section id="students" style={{ position:'relative', zIndex:2, padding:'6rem 1.5rem', background:`rgba(30, 64, 175, 0.02)` }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:'4.5rem' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', padding:'.4rem 1.1rem', borderRadius:999, border:`1px solid #b45309`, background:'rgba(180, 83, 9, 0.05)', color:'#b45309', fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'1.5rem' }}>★ Journey Stories</div>
              <h2 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:900, letterSpacing:'-0.03em', color: '#111827' }}>
                Words from the{' '}
                <span style={{ color: 'var(--cs-primary)' }}>Community.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={.2}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'auto auto', gap:'2rem' }}>
              {testimonials.map((t,i) => (
                <motion.div key={i} style={{ ...tGrid[i] }} whileHover={{ y:-8 }} transition={{ duration:.3 }}>
                  <div style={{ height:'100%', padding:'2.5rem', borderRadius:28, border:'1px solid var(--cs-border)', background:'white', position:'relative', overflow:'hidden', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)' }}>
                    <div style={{ color:'#b45309', fontSize:'1rem', letterSpacing:'.1em', marginBottom:'1.2rem' }}>★★★★★</div>
                    <div style={{ fontSize:'1rem', lineHeight:1.7, color:'var(--cs-text-light)', fontWeight: 500, marginBottom:'2rem' }}>{t.q}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'.9rem' }}>
                      <div style={{ width:48,height:48,borderRadius:'50%',background:`var(--cs-accent-wellness-light)`, border: '1px solid var(--cs-primary)', display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800, color: 'var(--cs-primary)', fontSize:'.9rem' }}>{t.init}</div>
                      <div>
                        <div style={{ fontWeight:800, fontSize:'.95rem', color: '#111827' }}>{t.name}</div>
                        <div style={{ fontSize:'.8rem', color:'var(--cs-text-muted)', fontWeight: 600 }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section style={{ position:'relative', zIndex:2, padding:'8rem 1.5rem' }}>
        <Reveal>
          <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center', padding:'6rem 3rem', borderRadius:48, border:'1.5px solid var(--cs-border)', background:'white', position:'relative', overflow:'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize:'4rem', marginBottom:'1.5rem' }}>🧘‍♂️</div>
            <motion.h2 animate={{ y:[0,-8,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
              style={{ fontSize:'clamp(3rem,6vw,5.5rem)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:1, marginBottom:'1.5rem', color: '#111827' }}>
              Find Your Peak.<br/>
              <span style={{ color: 'var(--cs-primary)' }}>Smart Learning.</span>
            </motion.h2>
            <p style={{ color:'var(--cs-text-light)', fontSize:'1.25rem', fontWeight: 500, maxWidth:600, margin:'0 auto 3.5rem', lineHeight:1.7 }}>
              Join the elite network of students mastering their potential with the world's most supportive AI ecosystem.
            </p>
            <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="cs-button-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.15rem' }}>Begin Your Journey →</button>
              <button className="cs-button-muted" style={{ padding: '1.25rem 3.5rem', fontSize: '1.15rem' }}>Sign In</button>
            </div>
            <p style={{ marginTop:'2.5rem', color:'var(--cs-text-muted)', fontSize:'.85rem', fontWeight: 600 }}>Premium experience · Academic focused · Privacy by design</p>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ position:'relative', zIndex:2, borderTop:'1px solid var(--cs-border)', padding:'4rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'2rem' }}>
          <div style={{ fontWeight:800, fontSize:'1.3rem', color: 'var(--cs-primary)', letterSpacing: '-0.02em' }}>Smart Education Platform</div>
          <div style={{ display:'flex', gap:'2.5rem' }}>
            {['Privacy','Terms','Philosophy','Community','Support'].map(l => (
              <a key={l} href="#" style={{ color:'var(--cs-text-light)', textDecoration:'none', fontSize:'.9rem', fontWeight: 600, transition:'color .2s' }}
                onMouseEnter={e=>e.target.style.color='var(--cs-primary)'} onMouseLeave={e=>e.target.style.color='var(--cs-text-light)'}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:'2.5rem auto 0', paddingTop:'2.5rem', borderTop:'1px solid var(--cs-border)', textAlign: 'center' }}>
          <p style={{ color:'var(--cs-text-muted)', fontSize:'.85rem', fontWeight: 500 }}>
            © 2024 Smart Education Platform. Built for the next generation of thinkers.
          </p>
        </div>
      </footer>
    </div>
  );
}
