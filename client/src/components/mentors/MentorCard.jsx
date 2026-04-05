import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();
  const isAvailable = mentor.availability;

  const handleRequestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/mentorship/request?mentorId=${mentor._id}`);
  };

  return (
    <div className="cs-card h-full flex flex-col p-4 relative" style={{ transition: 'transform 0.2s', cursor: 'default' }}>
      {/* Favorite Icon */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '1.25rem', cursor: 'pointer', zIndex: 10 }}>
        🤍
      </div>

      {/* Profile Image & Status */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ 
          width: '100%', 
          aspectRatio: '1/1', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          background: '#f3f4f6', 
          border: '1.5px solid var(--cs-border)' 
        }}>
          <img 
            src={mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`} 
            alt={mentor.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: '0.75rem', 
          left: '0.75rem',
          background: isAvailable ? 'var(--cs-accent-wellness-light)' : '#f3f4f6',
          color: isAvailable ? '#065f46' : 'var(--cs-text-muted)',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          fontSize: '0.7rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          border: isAvailable ? '1px solid #d1fae5' : '1px solid #e5e7eb'
        }}>
          {isAvailable ? '✓ AVAILABLE' : '🕒 BOOKED'}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', fontWeight: 800 }}>{mentor.name}</h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--cs-text-muted)', fontWeight: 500 }}>
          {mentor.jobTitle || 'Industry Professional'} at <span style={{ color: 'var(--cs-text-main)', fontWeight: 700 }}>{mentor.company || 'Tech Corp'}</span>
        </p>
        
        <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--cs-text-light)', lineHeight: 1.5 }}>
          {mentor.bio?.substring(0, 80)}...
        </p>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(mentor.expertise || ['SKILL', 'STRATEGY']).slice(0, 2).map(skill => (
            <span key={skill} style={{ 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              color: 'var(--cs-text-main)', 
              background: '#f3f4f6', 
              padding: '0.35rem 0.65rem', 
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {skill}
            </span>
          ))}
          {(mentor.expertise?.length > 2) && (
            <span style={{ fontSize: '0.7rem', color: 'var(--cs-text-muted)', alignSelf: 'center' }}>
              +{mentor.expertise.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleRequestClick}
        className={isAvailable ? 'cs-button-primary' : 'cs-button-muted'}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {isAvailable ? 'Request Session' : 'View Schedule'}
      </button>
    </div>
  );
};

export default MentorCard;
