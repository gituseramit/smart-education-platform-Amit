import { Link } from 'react-router-dom';
import { useState } from 'react';
import { resourceApi } from '../../services/resourceApi';

const ResourceCard = ({ resource, onDelete, currentUserId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'note':
        return '📝';
      case 'link':
        return '🔗';
      default:
        return '📁';
    }
  };

  const getBadgeColor = (subject) => {
    const colors = {
      'Math': 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
      'Physics': 'bg-[#f5f3ff] text-[#5b21b6] border-[#ddd6fe]',
      'Chemistry': 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
      'Biology': 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
      'Computer Science': 'bg-[#eef2ff] text-[#3730a3] border-[#c7d2fe]',
      'History': 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
      'English': 'bg-[#fff1f2] text-[#9f1239] border-[#fecdd3]',
      'Economics': 'bg-[#f0f9ff] text-[#075985] border-[#bae6fd]',
    };
    return colors[subject] || 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await resourceApi.delete(resource._id);
      onDelete(resource._id);
    } catch (error) {
      console.error('Failed to delete resource:', error);
      alert(error.response?.data?.message || 'Failed to delete resource');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Convert uploadedBy (string) vs user auth role if needed to show delete
  // Since we only have 'uploadedBy' as a string name in the schema, we'll just allow deletion loosely or hide it later 
  // In a real app we'd check resource.uploadedByUserId === currentUserId or isAdmin.

  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-[var(--cs-border)] p-6 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#f8fafc] border-[1.5px] border-[var(--cs-border)] flex items-center justify-center text-2xl group-hover:border-[var(--cs-primary)] transition-colors duration-300">
            {getIcon(resource.resourceType)}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-[1.5px] ${getBadgeColor(resource.subject)}`}>
            {resource.subject}
          </span>
        </div>
        
        {showConfirm ? (
          <div className="flex items-center space-x-2 text-xs">
            <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 font-extrabold hover:underline">Confirm</button>
            <button onClick={() => setShowConfirm(false)} disabled={isDeleting} className="text-[#94a3b8] font-bold">Cancel</button>
          </div>
        ) : (
          <button 
            onClick={() => setShowConfirm(true)} 
            className="w-8 h-8 rounded-lg bg-[#f8fafc] border-[1.5px] border-[var(--cs-border)] flex items-center justify-center text-[#94a3b8] hover:text-red-500 hover:border-red-100 transition-all"
            title="Delete Resource"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <h3 className="text-[1.1rem] font-black text-[#111827] mb-2 line-clamp-2 leading-snug tracking-tight">
        {resource.title}
      </h3>
      
      <p className="text-[.9rem] text-[#64748b] font-medium mb-5 line-clamp-2 flex-grow leading-relaxed">
        {resource.description || 'Contributed knowledge without description.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-5 border-t border-[var(--cs-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--cs-primary)] flex items-center justify-center text-white text-[.75rem] font-black">
            {resource.uploadedBy?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-[.8rem] font-extrabold text-[#334155]">{resource.uploadedBy}</span>
            <span className="text-[.7rem] text-[#94a3b8] font-bold">{formattedDate}</span>
          </div>
        </div>
        <Link 
          to={`/resources/${resource._id}`}
          className="bg-[var(--cs-primary)] text-white text-[.85rem] font-black px-5 py-2 rounded-xl transition-all hover:shadow-[0_8px_20px_-5px_rgba(30,64,185,0.4)] hover:scale-105 active:scale-95"
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
