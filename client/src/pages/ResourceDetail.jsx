import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resourceApi } from '../services/resourceApi';
import PDFViewer from '../components/resources/PDFViewer';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await resourceApi.getById(id);
        setResource(data);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError('Failed to load resource. It may have been deleted or the link is invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource? This cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      await resourceApi.delete(id);
      navigate('/resources');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete resource');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded-xl w-full max-w-4xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 mb-6">
          <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
          <p>{error}</p>
        </div>
        <Link to="/resources" className="text-primary-600 font-semibold hover:underline">
          &larr; Back to Library
        </Link>
      </div>
    );
  }

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

  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>

      {/* Top Nav/Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <Link to="/resources" className="inline-flex items-center text-[.9rem] font-bold text-[#64748b] hover:text-[#111827] transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-white border-[1.5px] border-[var(--cs-border)] flex items-center justify-center mr-3 group-hover:border-[var(--cs-primary)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </div>
          Return to Resource Library
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-6 py-2.5 border-[1.5px] border-red-100 text-[.85rem] font-black rounded-xl text-red-500 bg-white hover:bg-red-50 hover:border-red-200 transition-all w-max shadow-sm"
        >
          {isDeleting ? 'Erasing Knowledge...' : 'Delete Resource'}
        </button>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-[32px] border-[1.5px] border-[var(--cs-border)] p-10 md:p-12 mb-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center space-x-4 mb-6">
          <span className={`text-[.75rem] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border-[1.5px] ${getBadgeColor(resource.subject)}`}>
            {resource.subject}
          </span>
          <span className="text-[.75rem] font-black uppercase tracking-wider text-[#64748b] bg-[#f8fafc] border-[1.5px] border-[var(--cs-border)] px-3.5 py-1.5 rounded-full">
            {resource.resourceType} FORMAT
          </span>
        </div>
        
        <h1 className="text-[2.5rem] font-black text-[#111827] mb-6 tracking-tight leading-tight">
          {resource.title}
        </h1>
        
        {resource.description && (
          <p className="text-[1.1rem] text-[#64748b] mb-10 leading-relaxed font-medium">
            {resource.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-[var(--cs-border)] text-[.9rem] text-[#64748b]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[var(--cs-primary)] flex items-center justify-center text-white text-[.85rem] font-black">
                {resource.uploadedBy?.charAt(0).toUpperCase()}
             </div>
             <div>
               <div className="text-[.75rem] font-black text-[#94a3b8] uppercase tracking-wider mb-0.5">Contributor</div>
               <div className="font-extrabold text-[#111827]">{resource.uploadedBy}</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#f8fafc] border-[1.5px] border-[var(--cs-border)] flex items-center justify-center text-[#94a3b8]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
             <div>
               <div className="text-[.75rem] font-black text-[#94a3b8] uppercase tracking-wider mb-0.5">Shared On</div>
               <div className="font-extrabold text-[#111827]">{formattedDate}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mb-16">
        <h2 className="text-[.85rem] font-black text-[#94a3b8] mb-6 flex items-center uppercase tracking-[0.2em] justify-center">
          <div className="h-[1.5px] bg-[var(--cs-border)] flex-grow mr-6"></div>
          {resource.resourceType === 'pdf' ? '📜 Transcribed Document' : resource.resourceType === 'note' ? '🧠 Community Wisdom' : '🌐 External Oracle'}
          <div className="h-[1.5px] bg-[var(--cs-border)] flex-grow ml-6"></div>
        </h2>
        
        {/* Render PDF */}
        {resource.resourceType === 'pdf' && resource.fileURL && (
          <PDFViewer url={resource.fileURL} title={resource.title} />
        )}
 
        {/* Render Note (Markdown) */}
        {resource.resourceType === 'note' && resource.noteContent && (
          <div className="bg-white rounded-[32px] border-[1.5px] border-[var(--cs-border)] p-10 md:p-16 prose prose-slate max-w-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)] font-medium text-[#334155] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {resource.noteContent}
            </ReactMarkdown>
          </div>
        )}
 
        {/* Render Link */}
        {resource.resourceType === 'link' && resource.fileURL && (
          <div className="bg-white border-[1.5px] border-[var(--cs-border)] rounded-[32px] p-12 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-[#f8fafc] border-[1.5px] border-[var(--cs-border)] text-[var(--cs-primary)] rounded-full flex items-center justify-center mb-6 text-3xl shadow-sm">
              🔗
            </div>
            <h3 className="text-[1.5rem] font-black text-[#111827] mb-3 tracking-tight">External Study Beacon</h3>
            <p className="text-[#64748b] mb-10 max-w-sm font-medium leading-relaxed">
              This material resides beyond the platform. Expand your horizon in a new perspective.
            </p>
            <a 
              href={resource.fileURL.startsWith('http') ? resource.fileURL : `https://${resource.fileURL}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="cs-button-primary px-10 py-4 rounded-2xl text-[1rem] font-black shadow-[0_10px_25px_-5px_rgba(30,64,185,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              Access Resource
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            <div className="mt-8 break-all max-w-[80%] text-[.8rem] text-[#94a3b8] font-bold tracking-tight bg-[#f8fafc] px-4 py-2 rounded-lg border border-[var(--cs-border)]">
              {resource.fileURL}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetail;
