import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeadlineBadge from './DeadlineBadge';

const InternshipCard = ({ internship, index = 0 }) => {
  const companyName = internship.company || internship.companyId?.name || 'Unknown Company';
  const typeLabel = internship.type === 'remote' ? 'Remote' : internship.type === 'hybrid' ? 'Hybrid' : 'On-site';

  return (
    <div className="cs-card h-full flex flex-col p-5" style={{ transition: 'transform 0.2s', cursor: 'default' }}>
      {/* Header: Logo & Role */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '10px', 
          background: '#f3f4f6', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '1.2rem', 
          fontWeight: 800, 
          color: 'var(--cs-primary)',
          flexShrink: 0,
          border: '1px solid var(--cs-border)'
        }}>
          {companyName.charAt(0)}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: '0 0 0.15rem', fontSize: '1.05rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {internship.role}
          </h3>
          <div style={{ color: 'var(--cs-primary)', fontSize: '0.85rem', fontWeight: 700 }}>{companyName}</div>
        </div>
      </div>

      {/* Meta Labels */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ 
          fontSize: '0.7rem', 
          fontWeight: 800, 
          background: 'var(--cs-accent-wellness-light)', 
          color: '#065f46', 
          padding: '0.35rem 0.65rem', 
          borderRadius: '6px',
          textTransform: 'uppercase'
        }}>
          {typeLabel}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--cs-text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          📍 {internship.location}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--cs-text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          🕒 {internship.duration}
        </span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', flex: 1 }}>
        {(internship.skillsRequired || []).slice(0, 3).map((skill, i) => (
          <span key={i} style={{ 
            fontSize: '0.65rem', 
            fontWeight: 700, 
            background: '#f9fafb', 
            border: '1px solid var(--cs-border)', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '6px',
            color: 'var(--cs-text-main)' 
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Footer: Stipend & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cs-text-muted)', fontWeight: 600 }}>Stipend</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cs-text-main)' }}>
            {internship.stipend > 0 ? `₹${internship.stipend.toLocaleString()}` : 'Unpaid'}
          </div>
        </div>
        <Link to={`/internships/${internship._id}`} className="cs-button-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default InternshipCard;