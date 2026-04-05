import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  "How have you been feeling overall in the past week?",
  "How often do you feel overwhelmed by your studies?",
  "How would you rate the quality of your sleep recently?",
  "Do you feel you have a good support system (friends/family)?",
  "How often do you take time for hobbies or relaxation?",
  "Do you find it difficult to concentrate on your coursework?",
  "How often do you feel anxious about upcoming exams or deadlines?",
  "Have you experienced any changes in your appetite?",
  "How motivated do you feel to attend classes and complete assignments?",
  "Do you feel comfortable asking for help when you need it?",
  "How often do you compare yourself to your peers academically?",
  "Do you feel hopeful about your future career prospects?",
  "How often do you exercise or engage in physical activity?",
  "Have you been experiencing any physical symptoms of stress (e.g., headaches, stomachaches)?",
  "Do you feel you have a healthy work-life balance?",
  "How often do you feel lonely or isolated on campus?",
  "Do you feel confident in your ability to succeed in your program?",
  "How often do you experience negative or intrusive thoughts?",
  "Do you feel that you have sufficient time to manage all your responsibilities?",
  "Overall, how satisfied are you with your college experience?"
];

const OPTIONS = [
  { value: 1, label: 'Never', icon: '🟢', color: '#10b981' },
  { value: 2, label: 'Rarely', icon: '🔵', color: '#3b82f6' },
  { value: 3, label: 'Sometimes', icon: '🟡', color: '#f59e0b' },
  { value: 4, label: 'Often', icon: '🟠', color: '#f97316' },
  { value: 5, label: 'Always', icon: '🔴', color: '#ef4444' }
];

const MoodTracker = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(new Array(QUESTIONS.length).fill(null));
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setIsCompleted(true), 500);
    }
  };

  const calculateMood = () => {
    const totalScore = answers.reduce((a, b) => a + (b || 0), 0);
    if (totalScore < 40) return { title: 'Excellent', color: '#10b981', bg: '#ecfdf5', icon: '🌟', msg: 'You seem to be in a great headspace! Your mindset is thriving.' };
    if (totalScore < 60) return { title: 'Good', color: 'var(--cs-primary)', bg: 'var(--cs-accent-wellness-light)', icon: '😊', msg: 'You are doing fine. Remember to breathe and stay present.' };
    if (totalScore < 80) return { title: 'Stressed', color: '#f59e0b', bg: '#fffbeb', icon: '😟', msg: 'You appear to be experiencing some stress. Let’s focus on small wins today.' };
    return { title: 'High Alert', color: '#ef4444', bg: '#fef2f2', icon: '🆘', msg: 'Your responses indicate high stress. Please prioritize your well-being right now.' };
  };

  if (isCompleted) {
    const result = calculateMood();
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '2rem 1rem' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: result.bg, 
          color: result.color, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '2.5rem', 
          margin: '0 auto 1.5rem' 
        }}>
          {result.icon}
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: result.color, margin: '0 0 1rem' }}>{result.title}</h2>
        <p style={{ color: 'var(--cs-text-light)', fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 2rem', maxWidth: '400px' }}>{result.msg}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={() => { setAnswers(new Array(QUESTIONS.length).fill(null)); setCurrentStep(0); setIsCompleted(false); }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              border: '1.5px solid var(--cs-border)', 
              background: 'white', 
              color: 'var(--cs-text-main)', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
          >
            Retake Check-in
          </button>
          {(result.title === 'Stressed' || result.title === 'High Alert') && (
            <button className="cs-button-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Connect with Support
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const progress = ((currentStep) / QUESTIONS.length) * 100;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      {/* Progress */}
      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--cs-primary)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--cs-text-muted)', marginBottom: '2.5rem' }}>
        <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
        <span>{Math.round(progress)}% Focused</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textAlign: 'center', marginBottom: '3rem', color: '#111827', lineHeight: 1.4 }}>
            {QUESTIONS[currentStep]}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '1.25rem 0.5rem', 
                  borderRadius: '16px', 
                  border: '1.5px solid var(--cs-border)', 
                  background: 'white', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s' 
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--cs-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--cs-border)'; }}
              >
                <span style={{ fontSize: '1.8rem' }}>{opt.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cs-text-light)' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-start' }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: currentStep === 0 ? '#cbd5e1' : 'var(--cs-text-muted)', 
            fontWeight: 700, 
            fontSize: '0.9rem', 
            cursor: currentStep === 0 ? 'default' : 'pointer' 
          }}
        >
          ← Previous
        </button>
      </div>
    </div>
  );
};

export default MoodTracker;
