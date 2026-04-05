import React from 'react';

const skillOptions = [
  'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'TypeScript',
  'Machine Learning', 'SQL', 'MongoDB', 'Docker', 'CSS', 'HTML',
  'Data Structures', 'Algorithms', 'System Design'
];

const InternshipFilters = ({ filters, onFilterChange }) => {
  const { search = '', type = '', skills = [] } = filters;

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (newType) => {
    onFilterChange({ ...filters, type: type === newType ? '' : newType });
  };

  const handleSkillToggle = (skill) => {
    const newSkills = skills.includes(skill)
      ? skills.filter(s => s !== skill)
      : [...skills, skill];
    onFilterChange({ ...filters, skills: newSkills });
  };

  const clearAll = () => {
    onFilterChange({ search: '', type: '', skills: [] });
  };

  const hasActive = search || type || skills.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', insetY: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', height: '100%' }}>
          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--cs-text-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by role, company, or keyword..."
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
        />
      </div>

      {/* Row: Type & Skills Selection */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cs-text-muted)', marginRight: '0.5rem' }}>Role Type:</span>
          {['remote', 'onsite', 'hybrid'].map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              style={{ 
                padding: '0.4rem 0.8rem', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: type === t ? 'var(--cs-primary)' : 'white',
                color: type === t ? 'white' : 'var(--cs-text-main)',
                border: type === t ? '1.5px solid var(--cs-primary)' : '1.5px solid var(--cs-border)'
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {hasActive && (
          <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            × Clear all filters
          </button>
        )}
      </div>

      {/* Skills Selection */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cs-text-muted)', marginRight: '0.5rem' }}>Skills:</span>
        {skillOptions.map((skill) => {
          const isSelected = skills.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              style={{ 
                padding: '0.35rem 0.7rem', 
                borderRadius: '6px', 
                fontSize: '0.7rem', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isSelected ? 'var(--cs-accent-career-light)' : '#f9fafb',
                color: isSelected ? 'var(--cs-primary)' : 'var(--cs-text-main)',
                border: isSelected ? '1px solid var(--cs-primary)' : '1px solid var(--cs-border)'
              }}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InternshipFilters;