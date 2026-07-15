'use client';

import { useState, useRef, useEffect } from 'react';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-1',
      role: 'assistant',
      content: 'Hi! I am the Otto AI Assistant. How can I help you understand our platform or the Theme 2 industry playbooks?',
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: data.text || 'Sorry, I encountered an error.' },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: 'Network error communicating with the AI.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-on-primary rounded-full p-4 shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-medium hidden sm:inline">Ask AI Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-surface border border-surface-container-highest shadow-xl rounded-2xl w-[350px] max-h-[500px] flex flex-col overflow-hidden">
          <div className="bg-primary text-on-primary p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <h3 className="font-medium">Otto Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-on-primary/80">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-surface h-[300px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] p-3 rounded-2xl text-body-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-on-primary self-end rounded-tr-sm'
                    : 'bg-surface-container text-on-surface self-start rounded-tl-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-surface-container text-on-surface-variant p-3 rounded-2xl self-start text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-surface-container-highest bg-surface flex gap-2">
            <input
              className="flex-1 rounded-full border border-surface-container-highest px-4 py-2 text-body-sm focus:outline-none focus:border-primary bg-surface text-on-surface"
              value={input}
              placeholder="Ask about Otto..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-on-primary rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
