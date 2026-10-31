import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Bot, Send, User, Sparkles, Trash2, MessageSquare } from 'lucide-react';

export default function AiAssistant() {
  const location = useLocation();
  const associatedAnalysisId = location.state?.analysisId;

  const [conversations, setConversations] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations);
      if (res.data.conversations.length > 0 && !currentChatId) {
        selectChat(res.data.conversations[0]._id);
      } else if (res.data.conversations.length === 0) {
        createNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const createNewChat = async () => {
    try {
      const res = await api.post('/chat/conversations', {
        title: associatedAnalysisId ? 'Chart Analysis Chat' : 'New Stock Conversation',
        associatedAnalysisId: associatedAnalysisId || undefined
      });
      setConversations([res.data.conversation, ...conversations]);
      selectChat(res.data.conversation._id);
    } catch (err) {
      console.error(err);
    }
  };

  const selectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    try {
      const res = await api.get(`/chat/conversations/${chatId}`);
      setMessages(res.data.conversation.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentChatId) return;

    const userText = inputMessage;
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userText, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await api.post(`/chat/conversations/${currentChatId}/messages`, { content: userText });
      setMessages(res.data.conversation.messages);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What does RSI indicate when it crosses 70?',
    'How do I identify key support and resistance zones?',
    'What is the difference between Simple Moving Average and Exponential Moving Average?',
    'How should I calculate position risk percentage?'
  ];

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Conversations */}
        <div className="lg:w-80 bg-[#0c081e] border border-violet-900/40 rounded-3xl p-6 flex flex-col backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-white text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" /> Conversations
            </h2>
            <button
              onClick={createNewChat}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors"
            >
              + New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[500px] lg:max-h-[calc(100vh-250px)]">
            {conversations.map((chat) => (
              <div
                key={chat._id}
                onClick={() => selectChat(chat._id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  currentChatId === chat._id
                    ? 'bg-violet-600/20 border border-violet-500/50 text-white shadow-inner'
                    : 'bg-[#070514]/60 border border-violet-900/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-sm font-bold truncate">{chat.title}</div>
                <div className="text-[10px] text-slate-500 mt-1">{new Date(chat.updatedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-[#0c081e] border border-violet-900/50 rounded-3xl p-8 flex flex-col backdrop-blur-2xl shadow-2xl min-h-[650px]">
          <div className="flex items-center gap-4 border-b border-violet-950 pb-6 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-violet-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg">
              <Bot className="w-7 h-7 font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">StockVision AI Assistant</h1>
              <p className="text-xs text-slate-400">Ask educational questions about technical analysis, charts, and risk management.</p>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 mb-6 max-h-[500px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-5">
                <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
                <h3 className="text-xl font-black text-white">How can I help you understand the markets today?</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Choose a suggested topic below or type your technical analysis question.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl mt-4">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(q)}
                      className="p-3.5 text-left bg-[#070514]/90 border border-violet-900/40 rounded-2xl text-xs text-slate-300 hover:border-amber-400/50 transition-colors shadow-md"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-2xl bg-violet-950 border border-violet-800 flex items-center justify-center text-amber-400 shrink-0 shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-xl p-4.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-bold rounded-br-none shadow-xl'
                        : 'bg-[#070514]/90 border border-violet-900/50 text-slate-200 rounded-bl-none shadow-xl'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-violet-600 flex items-center justify-center text-white shrink-0 shadow">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3.5 items-center">
                <div className="w-9 h-9 rounded-2xl bg-violet-950 border border-violet-800 flex items-center justify-center text-amber-400">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#070514] border border-violet-900/50 p-4 rounded-2xl text-sm text-slate-400 shadow">
                  AI Assistant is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3.5">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about technical indicators, trendlines, risk..."
              className="flex-1 px-5 py-4 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-7 py-4 bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-violet-500/25 hover:opacity-95 disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
