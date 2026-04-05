import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get('/ai/chats');
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Failed to load chat history', error);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message) => {
    const userMessage = { role: 'user', message, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);

    try {
      const { data } = await api.post('/ai/chat', { message });
      const aiMessage = { role: 'assistant', message: data.response, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          message: 'Sorry, I could not reach the AI service. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-center">
            <div className="w-20 h-20 bg-[#f8fafc] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm border border-[var(--cs-border)] animate-bounce">
              ✨
            </div>
            <h3 className="text-[1.25rem] font-black text-[#111827] mb-2 tracking-tight">The Platform is Open</h3>
            <p className="text-[#64748b] font-medium max-w-xs leading-relaxed">
              Whisper your academic queries, and the collective wisdom shall respond.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={`${msg.role}-${idx}-${msg.createdAt}`} role={msg.role} message={msg.message} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#f8fafc] text-[.8rem] font-black text-[var(--cs-primary)] px-6 py-3 rounded-2xl border border-[var(--cs-border)] shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[var(--cs-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--cs-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[var(--cs-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              GEMINI IS TRANSCRIBING...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-8 pb-8 pt-4">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatWindow;
