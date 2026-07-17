'use client';
import React, { useState, useEffect } from 'react';
import { MessageCircle, ShieldAlert, CheckCircle2, AlertCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { ChatLog } from '@/lib/educationStore';

export function TelegramLiveFeed() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'resolved' | 'escalated' | 'pending'>('all');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'polling' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Initial fetch
    fetch('/api/education/chat-logs?limit=50')
      .then(res => res.json())
      .then(data => setLogs(data.logs || []))
      .catch(console.error);

    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      setConnectionStatus('disconnected');
      eventSource = new EventSource('/api/education/chat-logs/stream');
      
      eventSource.onopen = () => {
        setConnectionStatus('connected');
        if (pollInterval) clearInterval(pollInterval);
      };

      eventSource.onmessage = (event) => {
        if (event.data.includes('connected') || event.data.includes('heartbeat')) return;
        try {
          const newLog = JSON.parse(event.data);
          setLogs(prev => {
            const filtered = prev.filter(l => l.id !== newLog.id);
            return [newLog, ...filtered].slice(0, 50);
          });
        } catch (e) {
          console.error('Error parsing SSE data', e);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        setConnectionStatus('polling');
        // Fallback to polling
        pollInterval = setInterval(() => {
          fetch('/api/education/chat-logs?limit=50')
            .then(res => res.json())
            .then(data => setLogs(data.logs || []))
            .catch(() => setConnectionStatus('disconnected'));
        }, 5000);
      };
    };

    connectSSE();

    return () => {
      eventSource?.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.status === filter);

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-500" size={20} />
          <h2 className="text-label-lg font-semibold text-on-surface">Live Telegram Feed</h2>
          
          {/* Connection Status Indicator */}
          <div className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/20">
            {connectionStatus === 'connected' && (
              <>
                <Wifi size={10} className="text-green-500" />
                <span className="text-[9px] text-green-500 font-medium uppercase">Connected</span>
              </>
            )}
            {connectionStatus === 'polling' && (
              <>
                <Loader2 size={10} className="text-amber-500 animate-spin" />
                <span className="text-[9px] text-amber-500 font-medium uppercase">Polling (5s)</span>
              </>
            )}
            {connectionStatus === 'disconnected' && (
              <>
                <WifiOff size={10} className="text-red-500" />
                <span className="text-[9px] text-red-500 font-medium uppercase">Disconnected</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {['all', 'resolved', 'escalated', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`text-[11px] font-medium px-3 py-1.5 rounded-full capitalize transition ${
                filter === f 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-50">
            <MessageCircle size={32} className="mb-2" />
            <p className="text-body-sm">No messages found</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="p-3 rounded-lg border border-outline-variant/20 bg-surface-container-lowest hover:border-amber-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-on-surface text-label-sm">{log.user_name}</span>
                  <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">ID: {log.chat_id}</span>
                  <span className="text-[10px] text-on-surface-variant">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-amber-500 uppercase tracking-wider">{log.topic}</span>
                  {log.status === 'resolved' && <CheckCircle2 className="text-green-500" size={14} />}
                  {log.status === 'escalated' && <ShieldAlert className="text-red-500" size={14} />}
                  {log.status === 'pending' && <AlertCircle className="text-amber-500" size={14} />}
                </div>
              </div>
              
              <div className="mb-2">
                <p className="text-body-sm text-on-surface-variant bg-surface-container/50 p-2 rounded rounded-tl-none inline-block">
                  {log.message}
                </p>
              </div>
              
              <div>
                <p className="text-body-sm text-on-surface bg-blue-500/10 border border-blue-500/20 p-2 rounded rounded-tr-none inline-block">
                  <span className="font-semibold text-blue-400 mr-1 text-[11px] uppercase tracking-wider">AI:</span>
                  {log.ai_reply}
                </p>
                {log.confidence > 0 && (
                  <span className="text-[10px] text-on-surface-variant ml-2">
                    Conf: {(log.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
