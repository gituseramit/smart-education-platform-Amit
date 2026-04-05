import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mentorApi from '../services/mentorApi';
import SearchBar from '../components/mentors/SearchBar';
import IndustryFilter from '../components/mentors/IndustryFilter';
import AvailabilityToggle from '../components/mentors/AvailabilityToggle';
import MentorGrid from '../components/mentors/MentorGrid';

const T = { purple:'#AC6AFF', gold:'#FFC876', coral:'#FF776F', blue:'#858DFF' };

const MentorDiscovery = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [availability, setAvailability] = useState(false);
  const [sort, setSort] = useState('Most Experienced');

  useEffect(() => { fetchMentors(); }, [search, industry, availability, sort]);

  const fetchMentors = async () => {
    setIsLoading(true); setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (industry && industry !== 'All') params.industry = industry;
      if (availability) params.availability = true;
      if (sort) params.sort = sort;
      const data = await mentorApi.getAllMentors(params);
      setMentors(data.data || []);
    } catch (err) { console.error(err); setError('Could not load mentors. Please try again later.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111827' }}>Mentorship Discovery</h1>
          <p style={{ margin: 0, color: 'var(--cs-text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Connect with industry veterans who can guide your learning path, review your projects, and share career insights on the Smart Education Platform.
          </p>
        </div>
        <div style={{ 
          background: 'var(--cs-accent-wellness-light)', 
          padding: '0.5rem 1rem', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          border: '1px solid #d1fae5',
          color: '#065f46',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          ⚡ AI-Matched Mentors Available
        </div>
      </div>

      {/* Filter Row */}
      <div className="cs-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
        <div style={{ flex: 1 }}>
          <SearchBar onSearch={setSearch} />
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select 
            value={industry} 
            onChange={e => setIndustry(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', 
              background: 'white', 
              border: '1.5px solid var(--cs-border)', 
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">Industry: All</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
          </select>
          
          <button 
            onClick={() => setAvailability(!availability)}
            style={{ 
              background: availability ? 'var(--cs-primary)' : 'white', 
              color: availability ? 'white' : 'var(--cs-text-main)',
              border: availability ? '1.5px solid var(--cs-primary)' : '1.5px solid var(--cs-border)', 
              padding: '0.75rem 1rem', 
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {availability ? '✓ Available Only' : 'Show All Available'}
          </button>
          
          <button 
            onClick={() => { setSearch(''); setIndustry('All'); setAvailability(false); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--cs-text-light)', 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              cursor: 'pointer',
              padding: '0 0.5rem' 
            }}
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Mentor Grid */}
      <MentorGrid mentors={mentors} isLoading={isLoading}/>

      {/* Load More */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="cs-button-muted" style={{ padding: '0.75rem 2.5rem' }}>
          Load More Mentors
        </button>
      </div>
    </div>
  );
};

export default MentorDiscovery;
