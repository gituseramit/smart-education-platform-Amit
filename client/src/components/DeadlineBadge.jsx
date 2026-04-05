import React from 'react';

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let style, text, icon;

  if (diffDays < 0) {
    style = { background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' };
    text = 'Expired';
    icon = '⏰';
  } else if (diffDays <= 3) {
    style = { background: '#fff7ed', color: '#9a3412', borderColor: '#ffedd5' };
    text = `${diffDays}d left`;
    icon = '🔥';
  } else if (diffDays <= 7) {
    style = { background: '#f0f9ff', color: '#075985', borderColor: '#e0f2fe' };
    text = `${diffDays}d left`;
    icon = '⚡';
  } else {
    style = { background: '#f9fafb', color: '#4b5563', borderColor: '#f3f4f6' };
    text = deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    icon = '📅';
  }

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '0.4rem', 
      fontSize: '0.65rem', 
      fontWeight: 800, 
      padding: '0.3rem 0.6rem', 
      borderRadius: '6px', 
      border: '1px solid',
      ...style
    }}>
      <span style={{ fontSize: '0.75rem' }}>{icon}</span>
      {text}
    </span>
  );
};

export default DeadlineBadge;