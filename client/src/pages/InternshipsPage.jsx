import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import InternshipCard from '../components/InternshipCard';
import InternshipFilters from '../components/InternshipFilters';
import OpportunitiesWidget from '../components/dashboard/widgets/OpportunitiesWidget';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', lime:'#7ADB78', blue:'#858DFF' };

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', type: '', skills: [] });

  useEffect(() => { fetchInternships(); }, []);

  const fetchInternships = async () => {
    try { setLoading(true); setError(null); const r = await api.get('/internships?limit=50'); setInternships(r.data.internships || []); }
    catch (err) { console.error(err); setError('Unable to load internships. Please try again.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let r = internships;
    if (filters.search) { const q = filters.search.toLowerCase(); r = r.filter(i => i.role?.toLowerCase().includes(q) || (i.company || i.companyId?.name || '').toLowerCase().includes(q)); }
    if (filters.type) r = r.filter(i => i.type === filters.type);
    if (filters.skills.length > 0) r = r.filter(i => filters.skills.some(s => (i.skillsRequired || []).some(sk => sk.toLowerCase() === s.toLowerCase())));
    return r;
  }, [internships, filters]);

  const stats = [
    { label: 'Open Positions', value: internships.length, icon: '💼', color: 'var(--cs-primary)' },
    { label: 'Companies', value: new Set(internships.map(i => i.company || i.companyId?.name)).size, icon: '🏢', color: 'var(--cs-accent-wellness)' },
    { label: 'Skills Tracked', value: 15, icon: '🛠️', color: 'var(--cs-accent-career)' },
    { label: 'Remote Only', value: internships.filter(i => i.type === 'remote').length, icon: '🏠', color: 'var(--cs-primary)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111827' }}>Career Discovery</h1>
          <p style={{ margin: 0, color: 'var(--cs-text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Build your professional future on the Smart Education Platform. Explore high-impact internships vetted for growth.
          </p>
        </div>
        <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'var(--cs-accent-career-light)', border: '1px solid #fed7aa', color: '#9a3412', fontSize: '0.85rem', fontWeight: 700 }}>
          {filtered.length} Opportunities Found
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {stats.map(s => (
          <div key={s.label} className="cs-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${s.color}`, minHeight: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</span>
              <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cs-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="cs-card" style={{ padding: '1.5rem' }}>
        <InternshipFilters filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Results Section */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cs-card animate-pulse" style={{ height: '220px', background: '#f9fafb' }} />
          ))}
        </div>
      ) : error ? (
        <div className="cs-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 700, marginBottom: '1.5rem' }}>{error}</p>
          <button className="cs-button-primary" onClick={fetchInternships}>Try Again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cs-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ color: 'var(--cs-text-light)', fontSize: '1rem', fontWeight: 500 }}>No internships match your current filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((internship, i) => <InternshipCard key={internship._id} internship={internship} index={i} />)}
        </div>
      )}

      {/* External Opportunities */}
      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--cs-border)' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>External Opportunities</h2>
        <OpportunitiesWidget />
      </div>
    </div>
  );
};

export default InternshipsPage;