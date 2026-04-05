import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-[#f8fafc] p-3 rounded-[24px] border-[1.5px] border-[var(--cs-border)] shadow-sm focus-within:border-[var(--cs-primary)] focus-within:shadow-[0_0_0_4px_rgba(30,64,185,0.06)] transition-all">
      <button type="button" className="w-12 h-12 flex items-center justify-center text-xl hover:bg-white rounded-full transition-colors cursor-pointer text-[#64748b]">
        📎
      </button>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Seek academic wisdom..."
        className="flex-1 resize-none border-none outline-none py-3 text-[1rem] font-medium text-[#111827] background-transparent placeholder-[#94a3b8] bg-transparent"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={`cs-button-primary w-12 h-12 rounded-full flex items-center justify-center p-0 shadow-lg ${ (disabled || !value.trim()) ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-105 active:scale-95' } transition-all`}
      >
        <span className="text-xl">➤</span>
      </button>
    </form>
  );
};

export default ChatInput;
