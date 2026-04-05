import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search by name, expertise, or company..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', insetY: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', height: '100%' }}>
        <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--cs-text-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        style={{ 
          width: '100%', 
          paddingLeft: '2.75rem', 
          paddingRight: '1rem', 
          paddingTop: '0.9rem', 
          paddingBottom: '0.9rem', 
          background: 'white', 
          border: '1.5px solid var(--cs-border)', 
          borderRadius: '12px', 
          outline: 'none', 
          fontSize: '0.9rem',
          color: 'var(--cs-text-main)',
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--cs-primary)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--cs-border)'}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
