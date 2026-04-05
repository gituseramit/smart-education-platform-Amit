import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ role, message }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-3 mb-8`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'row'} gap-4 max-w-[85%] items-start group`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 mt-1 shadow-sm border-[1.5px] ${isUser ? 'bg-white border-[var(--cs-border)] text-[var(--cs-primary)]' : 'bg-[var(--cs-primary)] border-[#312e81] text-white'}`}>
          {isUser ? '👤' : '✨'}
        </div>

        {/* Bubble */}
        <div className={`p-6 rounded-[24px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] border-[1.5px] ${isUser ? 'bg-[#f0f9ff] border-[#bae6fd] text-[#0369a1]' : 'bg-white border-[var(--cs-border)] text-[#334155]'} leading-relaxed font-medium transition-all group-hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)]`}>
          {isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }} className="text-[.95rem]">{message}</div>
          ) : (
            <div className="prose prose-slate max-w-none text-[.95rem] font-medium selection:bg-[var(--cs-primary)] selection:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      {/* Bot Actions */}
      {!isUser && (
        <div className="flex flex-wrap gap-2 ml-14 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {['Clarify Concept', 'Practice Problem', 'Save to Study Map'].map(act => (
            <button key={act} className="bg-white border-[1.5px] border-[var(--cs-border)] rounded-full px-4 py-1.5 text-[.75rem] font-black text-[#64748b] hover:border-[var(--cs-primary)] hover:text-[var(--cs-primary)] transition-all cursor-pointer shadow-sm">
              {act}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
