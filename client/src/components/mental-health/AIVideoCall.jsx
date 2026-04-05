import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from '@vladmandic/face-api';
import api from '../../services/api';

/* ─── Color palette ─── */
const C = {
  primary: 'var(--cs-primary)',
  accent: 'var(--cs-accent-wellness)',
  muted: 'var(--cs-text-light)',
  border: 'var(--cs-border)',
  bg: '#f8fafc',
  panel: 'white',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b'
};

/* ─── Helpers ─── */
const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));

/* Calculate confidence 0-100 from face expression map */
const calcConfidence = (expr) => {
  if (!expr) return null;
  // happy + neutral + surprised contribute positively; fearful/sad negatively
  const pos = (expr.happy||0)*1.2 + (expr.neutral||0)*0.8 + (expr.surprised||0)*0.5;
  const neg = (expr.fearful||0)*1.5 + (expr.sad||0)*1.2 + (expr.disgusted||0)*1.0 + (expr.angry||0)*0.8;
  return clamp(Math.round((pos / (pos + neg + 0.001)) * 100), 10, 99);
};

/* Mood label from expressions */
const calcMood = (expr) => {
  if (!expr) return 'Neutral';
  const dominant = Object.entries(expr).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const MAP = { happy:'Happy', neutral:'Neutral', sad:'Sad', surprised:'Surprised', fearful:'Anxious', disgusted:'Distracted', angry:'Frustrated' };
  return MAP[dominant] || 'Neutral';
};

/* Mood color */
const moodColor = (mood) => ({ Happy:C.lime, Neutral:C.blue, Sad:C.coral, Anxious:C.gold, Surprised:C.purple, Distracted:C.coral, Frustrated:C.coral }[mood] || C.blue);

/* Waveform bar group */
const WaveGroup = ({ active, color, height = 24, count = 9 }) => (
  <div style={{ display:'flex', alignItems:'center', gap:2 }}>
    {Array.from({length:count},(_,i)=>{
      const h = [.5,.9,.3,.7,.4,.8,.6,1,.5][i%9];
      return (
        <motion.div key={i}
          animate={active ? { scaleY:[h,.2,h] } : { scaleY:.3 }}
          transition={{ duration:.6+i*.07, repeat:Infinity, delay:i*.05 }}
          style={{ width:3, height:height*h, borderRadius:3, background:color, transformOrigin:'center', flexShrink:0 }}/>
      );
    })}
  </div>
);

/* Single live-analysis metric row */
const MetricRow = ({ icon, label, value, type, color }) => {
  const isBar = type === 'bar';
  const isPill = type === 'pill';
  const isTag = type === 'tag';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.75rem', minHeight:34 }}>
      <span style={{ fontSize:'1rem', flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isBar?'.4rem':0 }}>
          <span style={{ fontSize:'.75rem', fontWeight:700, color:'var(--cs-text-light)' }}>{label}</span>
          {isPill && <span style={{ padding:'.2rem .75rem', borderRadius:999, background:`${color}12`, border:`1px solid ${color}30`, color, fontSize:'.7rem', fontWeight:800 }}>{value}</span>}
          {isTag && <span style={{ padding:'.2rem .75rem', borderRadius:8, background:`${color}08`, border:`1px solid ${color}25`, color, fontSize:'.7rem', fontWeight:800 }}>{value}</span>}
          {isBar && <span style={{ fontSize:'.75rem', fontWeight:800, color }}>{value}</span>}
        </div>
        {isBar && (
          <div style={{ height:6, borderRadius:999, background:'#f1f5f9', overflow:'hidden' }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:value }}
              transition={{ duration:.9 }}
              style={{ height:'100%', borderRadius:999, background:color }}/>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────── MAIN COMPONENT ─────────────────────────────────── */
const AIVideoCall = () => {
  /* ── State ── */
  const [callStatus, setCallStatus] = useState('idle');   // idle | active | ended
  const [callDuration, setCallDuration] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Initializing AI systems...');

  /* Live analysis */
  const [confidence, setConfidence] = useState(null);     // null until first detection
  const [mood, setMood]             = useState('Neutral');
  const [engagement, setEngagement] = useState(100);
  const [eyeContact, setEyeContact] = useState(true);
  const [posture, setPosture]       = useState('Good');
  const [gesture, setGesture]       = useState('Open Statement');
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceBox, setFaceBox]       = useState(null); // { x, y, width, height }
  const [eyes, setEyes]             = useState(null); // { left: {x,y}, right: {x,y} }

  /* Chat / voice */
  const [messages, setMessages]     = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micMuted, setMicMuted]     = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [chatInput, setChatInput]   = useState('');
  const [apiError, setApiError]     = useState(null);

  /* Refs */
  const videoRef         = useRef(null);
  const canvasRef        = useRef(null);
  const streamRef        = useRef(null);
  const analysisRef      = useRef(null);
  const recognitionRef   = useRef(null);
  const timerRef         = useRef(null);
  const engagementRef    = useRef(100);
  const lastFaceRef      = useRef(Date.now());
  const isProcessingRef  = useRef(false);   // guard: prevent duplicate API calls
  const cachedVoiceRef   = useRef(null);    // cached TTS voice
  const debounceRef      = useRef(null);    // STT debounce timer
  const isSpeakingRef    = useRef(false);   // sync ref for STT pause logic
  const confidenceRef    = useRef(null);    // latest confidence (avoid stale closure)
  const moodRef          = useRef('Neutral');

  /* Keep refs in sync with state */
  useEffect(() => { confidenceRef.current = confidence; }, [confidence]);
  useEffect(() => { moodRef.current = mood; }, [mood]);

  /* ── Pre-cache TTS voice once voices are loaded ── */
  useEffect(() => {
    const cacheVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      cachedVoiceRef.current =
        voices.find(v => /female|woman|zira|samantha|victoria|aria|google uk.*female/i.test(v.name)) ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];
    };
    cacheVoice();
    window.speechSynthesis.addEventListener('voiceschanged', cacheVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', cacheVoice);
  }, []);

  /* ── Load face-api models ── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingMsg('Loading face analysis models...');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        setLoadingMsg('Models ready ✓');
      } catch {
        setLoadingMsg('Starting without face models...');
      }
      setModelsLoaded(true);
    };
    load();
  }, []);

  /* ── Start call ── */
  const startCall = useCallback(async () => {
    setCallStatus('active');
    setMessages([{ role:'ai', text:`Hello! I'm Priya, your AI study guide. I'm analyzing your confidence and engagement in real-time. What would you like to work on today?` }]);

    // Start webcam
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }

      // Start face analysis loop
      analysisRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const det = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceExpressions();

          if (det) {
            lastFaceRef.current = Date.now();
            setFaceDetected(true);

            const expr = det.expressions;
            const newConf = calcConfidence(expr);
            setConfidence(newConf);
            setMood(calcMood(expr));

            // Eye contact: rough proxy — face must be mostly centered
            const box = det.detection.box;
            const dims = det.detection.imageDims;
            
            // Normalize box for HUD % positioning
            setFaceBox({
              x: (box.x / dims.width) * 100,
              y: (box.y / dims.height) * 100,
              w: (box.width / dims.width) * 100,
              h: (box.height / dims.height) * 100
            });

            const lms = det.landmarks.positions;
            // Eyes: index 36-41 (left), 42-47 (right)
            const leftEye = lms.slice(36, 42).reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
            const rightEye = lms.slice(42, 48).reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
            
            setEyes({
              left: { x: (leftEye.x / 6 / dims.width) * 100, y: (leftEye.y / 6 / dims.height) * 100 },
              right: { x: (rightEye.x / 6 / dims.width) * 100, y: (rightEye.y / 6 / dims.height) * 100 }
            });

            const cx = box.x + box.width/2;
            const vw = videoRef.current.videoWidth || 640;
            setEyeContact(Math.abs(cx - vw/2) < vw*0.22);

            // Posture & Gesture heuristics
            const yMin = Math.min(...lms.map(p=>p.y));
            const yMax = Math.max(...lms.map(p=>p.y));
            const spread = (yMax - yMin) / (box.height || 1);
            setPosture(spread > 0.75 ? 'Optimal' : spread > 0.65 ? 'Neutral' : 'Hunched');
            
            // Gesture: check tilt or movement
            const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
            if (Math.abs(roll) > 0.15) setGesture('Curious Tilt');
            else if (box.width > dims.width * 0.45) setGesture('Leaning Forward');
            else setGesture('Attentive Stay');

            engagementRef.current = clamp(engagementRef.current + 1, 0, 100);
            setEngagement(Math.round(engagementRef.current));
          } else {
            setFaceDetected(false);
            setFaceBox(null);
            setEyes(null);
            const secsSinceFace = (Date.now() - lastFaceRef.current) / 1000;
            if (secsSinceFace > 3) {
              engagementRef.current = clamp(engagementRef.current - 2, 20, 100);
              setEngagement(Math.round(engagementRef.current));
              setEyeContact(false);
            }
          }
        } catch { /* face-api errors are non-fatal */ }
      }, 1500);
    } catch (err) {
      console.warn('Webcam unavailable:', err);
    }

    // Start timer
    timerRef.current = setInterval(() => setCallDuration(d => d+1), 1000);

    // Speak greeting
    speakText(`Hello! I'm Priya, your AI study guide. I'm analyzing your confidence and engagement in real time. What would you like to work on today?`);

    // Start mic listening
    startListening();
  }, []);

  /* ── End call ── */
  const endCall = useCallback(() => {
    setCallStatus('ended');
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(analysisRef.current);
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
  }, []);

  /* ── Duration formatter ── */
  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  /* ── STT: start listening (pauses while AI speaks) ── */
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || micMuted) return;
    // Don't start a new recogniser if one is already active
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch {} }

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      // Ignore STT results while AI is speaking to avoid echo
      if (isSpeakingRef.current) return;

      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) { final += e.results[i][0].transcript; }
        else { interim += e.results[i][0].transcript; }
      }
      setTranscript(interim || final);

      if (final.trim()) {
        // Debounce: wait 400 ms after final result before sending
        clearTimeout(debounceRef.current);
        const captured = final.trim();
        debounceRef.current = setTimeout(() => handleUserMessage(captured), 400);
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return; // benign
      console.warn('STT error:', e.error);
    };

    // Auto-restart when recognition ends (browser stops it after silence)
    rec.onend = () => {
      if (callStatus === 'active' && !micMuted && !isSpeakingRef.current) {
        try { rec.start(); } catch {}
      }
    };

    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  }, [micMuted, callStatus]);

  /* ── Send user message to AI (clean API call) ── */
  const handleUserMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    if (isProcessingRef.current) return; // prevent duplicate calls
    isProcessingRef.current = true;

    setApiError(null);
    setTranscript('');
    setChatInput('');
    // Add user message immediately for responsive feel
    setMessages(prev => [...prev, { role:'user', text }]);
    setIsAiThinking(true);

    try {
      // Build clean message with context injected as a PREFIX — server system prompt stays intact
      const contextPrefix = [
        `[Session context — confidence: ${confidenceRef.current ?? '?'}%, mood: ${moodRef.current}]`,
        'You are Priya, a warm AI study guide. Reply in 2-4 concise, encouraging sentences.',
        `Student says: ${text}`,
      ].join('\n');

      const res = await api.post('/ai/chat', { message: contextPrefix });
      const reply = (res.data.response || '').trim() ||
        "That's a great question! Let me think through this with you.";

      setMessages(prev => [...prev, { role:'ai', text:reply }]);
      speakText(reply);
    } catch (err) {
      console.error('AI Chat error:', err);
      // One automatic retry with a simpler message
      try {
        const retryRes = await api.post('/ai/chat', { message: text });
        const retryReply = (retryRes.data.response || '').trim() ||
          "I heard you! Let me think...";
        setMessages(prev => [...prev, { role:'ai', text:retryReply }]);
        speakText(retryReply);
      } catch {
        const fallback = "I'm here with you! Could you repeat that? Let's explore your topic together.";
        setMessages(prev => [...prev, { role:'ai', text:fallback }]);
        speakText(fallback);
        setApiError('Connection hiccup — retried automatically.');
      }
    } finally {
      setIsAiThinking(false);
      isProcessingRef.current = false;
    }
  }, []);

  /* ── Text-to-speech (uses pre-cached voice, pauses mic while speaking) ── */
  const speakText = useCallback((text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    // Pause STT recognition while speaking to eliminate echo
    isSpeakingRef.current = true;
    try { recognitionRef.current?.abort(); } catch {}

    const utt = new SpeechSynthesisUtterance(text);
    if (cachedVoiceRef.current) utt.voice = cachedVoiceRef.current;
    utt.rate = 0.92;   // slightly slower = more natural
    utt.pitch = 1.08;
    utt.volume = 1.0;

    utt.onstart = () => setIsAiSpeaking(true);
    utt.onend = () => {
      setIsAiSpeaking(false);
      isSpeakingRef.current = false;
      // Resume listening after AI finishes speaking (300 ms delay to avoid echo pickup)
      setTimeout(() => {
        if (callStatus === 'active') startListening();
      }, 300);
    };
    utt.onerror = () => {
      setIsAiSpeaking(false);
      isSpeakingRef.current = false;
    };

    // Chromium bug: SpeechSynthesis can get stuck — workaround with resume()
    synth.speak(utt);
    requestAnimationFrame(() => synth.pause());
    setTimeout(() => synth.resume(), 50);
  }, [callStatus, startListening]);

  const toggleMic = useCallback(() => {
    setMicMuted(m => {
      const muted = !m;
      if (muted) {
        try { recognitionRef.current?.abort(); } catch {}
        setIsListening(false);
      } else {
        setTimeout(() => startListening(), 100);
      }
      return muted;
    });
  }, [startListening]);

  const toggleVideo = useCallback(() => {
    setVideoMuted(v => {
      const newVal = !v;
      streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !newVal; });
      return newVal;
    });
  }, []);

  /* cleanup on unmount */
  useEffect(() => () => {
    clearTimeout(debounceRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(analysisRef.current);
    clearInterval(timerRef.current);
    try { recognitionRef.current?.abort(); } catch {}
    window.speechSynthesis.cancel();
    isProcessingRef.current = false;
    isSpeakingRef.current = false;
  }, []);

  /* ─── STYLE CONSTANTS ─── */
  const panelSt = { background:C.panel, border:`1px solid ${C.border}`, backdropFilter:'blur(24px)', borderRadius:20 };

  /* ════════════════════════ IDLE SCREEN ════════════════════════ */
  if (callStatus === 'idle') return (
    <div style={{ minHeight:'75vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{ width:'100%', maxWidth:500, background:'white', border:'1.5px solid var(--cs-border)', borderRadius:24, padding:'3rem 2.5rem', textAlign:'center', position:'relative', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        
        {/* AI Avatar */}
        <div style={{ position:'relative', width:140, height:140, margin:'0 auto 2rem' }}>
          <div style={{ 
            width:'100%', 
            height:'100%', 
            borderRadius:'50%', 
            background:'var(--cs-accent-wellness-light)', 
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center', 
            border:'2px solid var(--cs-primary)',
            boxShadow:'0 0 30px var(--cs-accent-wellness-light)'
          }}>
            <span style={{ fontSize:'4.5rem' }}>👩‍💻</span>
          </div>
          <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', inset:-8, borderRadius:'50%', border:'2px dashed var(--cs-primary)', opacity:0.3 }}/>
        </div>

        <h2 style={{ fontSize:'1.8rem', fontWeight:900, marginBottom:'0.75rem', color: '#111827' }}>
          Meet Priya
        </h2>
        <p style={{ color:'var(--cs-text-light)', fontSize:'0.95rem', lineHeight:1.6, marginBottom:'2.5rem' }}>
          Your real-time AI study guide. I use advanced face analysis to monitor your focus and confidence, helping you reach your full potential today.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'2.5rem' }}>
          {[['🧠','Mood Analysis'],['📊','Confidence'],['👁️','Eye Contact'],['🎙️','Voice Chat']].map(([e,t])=>(
            <div key={t} style={{ padding:'1rem', borderRadius:16, background:'#f8fafc', border:'1px solid var(--cs-border)', textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'.4rem' }}>{e}</div>
              <div style={{ fontWeight:800, fontSize:'.75rem', color:'var(--cs-text-main)' }}>{t}</div>
            </div>
          ))}
        </div>

        <button 
          disabled={!modelsLoaded}
          onClick={startCall}
          className="cs-button-primary"
          style={{ width:'100%', padding:'1.25rem', fontSize:'1.1rem', opacity:modelsLoaded?1:0.7 }}
        >
          {modelsLoaded ? '🚀 Start Session with Priya' : 'Preparing AI Systems...'}
        </button>
      </motion.div>
    </div>
  );

  /* ════════════════════════ ENDED SCREEN ════════════════════════ */
  if (callStatus === 'ended') return (
    <div style={{ minHeight:'75vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
        style={{ maxWidth:450, width:'100%', background: 'white', border: '1.5px solid var(--cs-border)', borderRadius: 24, padding:'3rem', textAlign:'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:'1.5rem' }}>🎓</div>
        <h2 style={{ fontWeight:900, fontSize:'1.8rem', color: C.primary, marginBottom:'.75rem' }}>Session Complete</h2>
        <p style={{ color:'var(--cs-text-light)', marginBottom:'2rem', fontWeight: 600 }}>Total Duration: {fmt(callDuration)}</p>
        {confidence && (
          <div style={{ padding:'1.5rem', borderRadius:20, background:`var(--cs-accent-wellness-light)`, border:`1px solid var(--cs-primary)`, marginBottom:'2.5rem' }}>
            <div style={{ fontSize:'.8rem', fontWeight: 800, color: 'var(--cs-primary)', marginBottom:'.5rem', letterSpacing: '0.05em' }}>PEAK CONFIDENCE</div>
            <div style={{ fontSize:'3rem', fontWeight:900, color: 'var(--cs-primary)' }}>{confidence}%</div>
          </div>
        )}
        <button 
          onClick={() => { setCallStatus('idle'); setMessages([]); setCallDuration(0); setConfidence(null); }}
          className="cs-button-primary"
          style={{ width:'100%', padding:'1.1rem', fontSize: '1rem' }}
        >
          Start New Reflection
        </button>
      </motion.div>
    </div>
  );

  /* ════════════════════════ ACTIVE CALL ════════════════════════ */
  const confVal = confidence ?? 72;
  const eyeLabel = eyeContact ? 'Focused' : 'Distracted';
  const eyeColor = eyeContact ? C.lime : C.coral;
  const postureColor = posture === 'Good' ? C.gold : C.coral;

  return (
    <div style={{ height:'calc(100vh - 120px)', display:'flex', flexDirection:'column', background: '#0f172a', overflow:'hidden', position:'relative', borderRadius: 24, margin: '1rem' }}>
      <style>{`
        .hud-scanline {
          position: absolute; width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, #22d3ee, transparent);
          box-shadow: 0 0 15px #22d3ee; z-index: 5;
          animation: scan 3s linear infinite;
        }
        @keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .hud-corner { position: absolute; width: 20px; height: 20px; border: 2px solid #22d3ee; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── TOP BAR: System Status ── */}
      <div style={{ 
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', 
        borderBottom:`1px solid rgba(255,255,255,0.1)`, background:'rgba(15, 23, 42, 0.8)', backdropFilter:'blur(12px)', zIndex:20 
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <motion.div animate={{ opacity:[1,.3,1] }} transition={{ duration:1.5, repeat:Infinity }}
            style={{ width:10, height:10, borderRadius:'50%', background:'#22d3ee', boxShadow: '0 0 10px #22d3ee' }}/>
          <span style={{ fontWeight:900, fontSize:'.85rem', color:'#22d3ee', letterSpacing:'0.15em' }}>AI ANALYSIS ACTIVE</span>
          <span style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.5)', fontWeight:700, fontFamily: 'monospace' }}>[{fmt(callDuration)}]</span>
        </div>
        
        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase' }}>Security Protocol</div>
            <div style={{ fontSize: '.75rem', color: '#fff', fontWeight: 700 }}>End-to-End Encrypted</div>
          </div>
          <button onClick={endCall} className="cs-button-muted" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '.5rem 1.25rem' }}>
            Terminate Session
          </button>
        </div>
      </div>

      {/* ── MAIN ANALYTIC INTERFACE ── */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 380px', gap:'1rem', padding:'1rem', overflow:'hidden' }}>
        
        {/* LEFT: PRIMARY ANALYSIS FEED (Video + HUD) */}
        <div className="cs-card" style={{ 
          position:'relative', background:'#000', border:'1px solid rgba(255,255,255,0.1)', 
          overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', borderRadius: 24 
        }}>
          {!videoMuted ? (
            <>
              <video ref={videoRef} autoPlay muted playsInline 
                style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)', opacity: 0.85 }}/>
              
              {/* ANALYSIS HUD OVERLAY */}
              <div style={{ position:'absolute', inset:0, zIndex:10, pointerEvents:'none' }}>
                <div className="hud-scanline" />
                
                {/* Face Tracking Square */}
                <AnimatePresence>
                  {faceBox && (
                    <motion.div
                      initial={{ opacity:0, scale:0.8 }}
                      animate={{ 
                        opacity:1, scale:1,
                        left: `${100 - faceBox.x - faceBox.w}%`, // Inverted for mirror
                        top: `${faceBox.y}%`,
                        width: `${faceBox.w}%`,
                        height: `${faceBox.h}%`
                      }}
                      style={{ position:'absolute', border:'1.5px solid #22d3ee', boxShadow:'0 0 20px rgba(34, 211, 238, 0.3)', borderRadius: 4 }}
                    >
                      {/* Corners for technical look */}
                      <div className="hud-corner" style={{ top:-2, left:-2, borderRight:'none', borderBottom:'none' }} />
                      <div className="hud-corner" style={{ top:-2, right:-2, borderLeft:'none', borderBottom:'none' }} />
                      <div className="hud-corner" style={{ bottom:-2, left:-2, borderRight:'none', borderTop:'none' }} />
                      <div className="hud-corner" style={{ bottom:-2, right:-2, borderLeft:'none', borderTop:'none' }} />
                      
                      {/* Face Label */}
                      <div style={{ position:'absolute', top:-25, left:0, background:'#22d3ee', color:'#000', fontSize:'0.6rem', fontWeight:900, padding:'2px 6px', borderRadius:'2px 2px 0 0' }}>
                        SUBJECT_SEC_01: {mood.toUpperCase()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Eye Tracking Markers */}
                <AnimatePresence>
                  {eyes && faceDetected && (
                    <>
                      {[eyes.left, eyes.right].map((eye, idx) => (
                        <motion.div key={idx}
                          animate={{ left: `${100 - eye.x}%`, top: `${eye.y}%` }}
                          style={{ position:'absolute', width:12, height:12, border:'1px solid #22d3ee', borderRadius:'50%', transform:'translate(-50%, -50%)' }}
                        >
                          <div style={{ position:'absolute', inset:4, background:'#22d3ee', borderRadius:'50%' }} />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Floating Analytic Data */}
                <div style={{ position:'absolute', bottom: 30, left: 30, display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  <div style={{ color:'#22d3ee', fontSize:'.7rem', fontWeight:800, fontFamily:'monospace', background:'rgba(0,0,0,0.6)', padding:'4px 10px', borderRadius: 4, borderLeft: '3px solid #22d3ee' }}>
                    GESTURE: {gesture.toUpperCase()}
                  </div>
                  <div style={{ color:'#22d3ee', fontSize:'.7rem', fontWeight:800, fontFamily:'monospace', background:'rgba(0,0,0,0.6)', padding:'4px 10px', borderRadius: 4, borderLeft: '3px solid #22d3ee' }}>
                    POSTURE: {posture.toUpperCase()}
                  </div>
                </div>

                {/* Corner Decorative HUD */}
                <div style={{ position:'absolute', top:30, right:30, textAlign:'right' }}>
                  <div style={{ fontSize:'1.2rem', fontWeight:900, color:'#fff', marginBottom:'.2rem' }}>{confVal}%</div>
                  <div style={{ fontSize:'.6rem', fontWeight:800, color:'#22d3ee', letterSpacing:'.1em' }}>CONFIDENCE_INDEX</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color:'rgba(255,255,255,0.2)', fontSize:'4rem' }}>📵 Feed Interrupted</div>
          )}

          {/* User Controls Overlay */}
          <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)', display:'flex', gap:'1rem', zIndex:30 }}>
            <button onClick={toggleMic} style={{ width:50, height:50, borderRadius:'50%', border:'none', background:micMuted?'#ef4444':'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', color:'#fff', cursor:'pointer', fontSize:'1.2rem' }}>
              {micMuted ? '🔇' : '🎙️'}
            </button>
            <button onClick={toggleVideo} style={{ width:50, height:50, borderRadius:'50%', border:'none', background:videoMuted?'#ef4444':'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', color:'#fff', cursor:'pointer', fontSize:'1.2rem' }}>
              {videoMuted ? '📵' : '📷'}
            </button>
          </div>
        </div>

        {/* RIGHT: SECONDARY INTEL (Metrics + Chat) */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem', overflow:'hidden' }}>
          
          {/* AI Tutor Info Card */}
          <div className="cs-card" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:54, height:54, borderRadius:'50%', background:'var(--cs-accent-wellness-light)', display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid #22d3ee' }}>
                <span style={{ fontSize:'1.8rem' }}>👩‍💻</span>
              </div>
              {isAiSpeaking && <motion.div animate={{ scale:[1,1.3,1], opacity:[0.5,0,0.5] }} transition={{ duration:1.5, repeat:Infinity }} style={{ position:'absolute', inset:-4, borderRadius:'50%', border:'2px solid #22d3ee' }}/>}
            </div>
            <div>
              <div style={{ fontWeight:800, color:'#fff', fontSize:'.95rem' }}>Guardian Priya</div>
              <div style={{ fontSize:'.7rem', color:'#22d3ee', fontWeight:700 }}>SYNTHETIC_INTEL_V4.2</div>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="cs-card" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)', padding:'1.25rem' }}>
             <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
               <MetricRow icon="🧠" label="MOOD" type="tag" value={mood} color={moodColor(mood)}/>
               <MetricRow icon="⚡" label="FOCUS" type="bar" value={`${engagement}%`} color="#22d3ee"/>
               <MetricRow icon="🧘" label="STRESS" type="bar" value={`${100 - confVal}%`} color="#f43f5e"/>
             </div>
          </div>

          {/* Chat Stream */}
          <div className="cs-card hide-scrollbar" style={{ flex:1, background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.05)', padding:'1.25rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {messages.map((m,i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ 
                  maxWidth:'90%', padding:'.7rem 1rem', borderRadius: 16,
                  background:m.role==='user'?'#1e3a8a':'rgba(255,255,255,0.05)', 
                  color:m.role==='user'?'#fff':'#cbd5e1', fontSize:'.85rem', fontWeight:500, lineHeight:1.5
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isAiThinking && (
              <div style={{ display:'flex', gap:'4px', padding:'0.5rem' }}>
                {[0,1,2].map(i => <motion.div key={i} animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:0.8, repeat:Infinity, delay:i*0.2 }} style={{ width:4, height:4, borderRadius:'50%', background:'#22d3ee' }}/>)}
              </div>
            )}
          </div>

          {/* Voice Command Input */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'.75rem 1rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:isListening?'#ef4444':'#64748b' }}/>
            <input 
              value={transcript || chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleUserMessage(chatInput||transcript)}
              placeholder="System listening..."
              style={{ flex:1, background:'none', border:'none', color:'#fff', fontSize:'.85rem', outline:'none' }}/>
            {isAiSpeaking && <WaveGroup active color="#22d3ee" height={14} count={5}/>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIVideoCall;
