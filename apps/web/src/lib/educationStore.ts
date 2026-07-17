export interface ChatLog {
  id: string;
  user_name: string;
  chat_id: string;
  message: string;
  ai_reply: string;
  topic: string;
  confidence: number;
  timestamp: string;
  status: 'resolved' | 'escalated' | 'pending';
  conversation_id?: string;
}

const educationChatLogs: ChatLog[] = [
  {
    id: 'mock-1',
    user_name: 'Sarah M.',
    chat_id: '12345',
    message: 'When is the deadline for 10th grade admission?',
    ai_reply: 'The deadline for 10th grade admissions is August 15th, 2026.',
    topic: 'admission',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: 'resolved',
  },
  {
    id: 'mock-2',
    user_name: 'David K.',
    chat_id: '12346',
    message: 'I cannot find the fee payment portal.',
    ai_reply: 'You can access the fee payment portal at portal.school.edu/fees.',
    topic: 'fees',
    confidence: 0.88,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'resolved',
  }
];

type Listener = (log: ChatLog) => void;
const listeners: Set<Listener> = new Set();

export const educationStore = {
  subscribeToChatLogs(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  addChatLog(log: Omit<ChatLog, 'id'>) {
    const newLog = { ...log, id: Math.random().toString(36).substring(7) };
    educationChatLogs.unshift(newLog as ChatLog);
    if (educationChatLogs.length > 200) {
      educationChatLogs.length = 200;
    }
    listeners.forEach(listener => listener(newLog as ChatLog));
    return newLog;
  },

  getChatLogs() {
    return educationChatLogs;
  },

  getStats() {
    const resolved = educationChatLogs.filter(l => l.status === 'resolved').length;
    const escalated = educationChatLogs.filter(l => l.status === 'escalated').length;
    const pending = educationChatLogs.filter(l => l.status === 'pending').length;
    return {
      total_today: educationChatLogs.length,
      resolved,
      escalated,
      pending,
      avg_response_ms: 1250 // mocked for now
    };
  }
};
