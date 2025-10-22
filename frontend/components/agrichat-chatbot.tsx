'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Leaf, 
  Sparkles, 
  Loader2,
  MessageSquare,
  Clock,
  Mic,
  MicOff
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function AgriChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/api/conversation_history`, { method: 'GET' });
        if (res.status === 401) {
          // Not authenticated; show default greeting
          setMessages([{
            id: 'greet',
            content: 'Hello! I\'m AgriSense AI Assistant. I can help you with crop recommendations, weather analysis, farming tips, and more. How can I assist you today?',
            role: 'assistant',
            timestamp: new Date()
          }]);
          return;
        }
        if (!res.ok) throw new Error('Failed to load history');
        const json = await res.json();
        const history: Message[] = (json?.data || []).map((row: { id: number; message: string; role: string; created_at: string }) => ({
          id: String(row.id),
          content: row.message,
          role: row.role === 'assistant' ? 'assistant' : 'user',
          timestamp: row.created_at ? new Date(row.created_at) : new Date(),
        }));

        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([{
            id: 'greet',
            content: 'Hello! I\'m AgriSense AI Assistant. I can help you with crop recommendations, weather analysis, farming tips, and more. How can I assist you today?',
            role: 'assistant',
            timestamp: new Date()
          }]);
        }
      } catch {
        setMessages([{
          id: 'greet',
          content: 'Hello! I\'m AgriSense AI Assistant. I can help you with crop recommendations, weather analysis, farming tips, and more. How can I assist you today?',
          role: 'assistant',
          timestamp: new Date()
        }]);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const quickQuestions = [
    "What crops grow best in sandy soil?",
    "How much water does wheat need daily?",
    "Best organic fertilizers for vegetables?",
    "How to prevent tomato blight?",
    "When to harvest corn in summer?",
    "Irrigation tips for dry seasons",
    "Crop rotation benefits and methods",
    "Soil pH testing and adjustment"
  ];

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    if (!customMessage) {
      setInput('');
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend, email: userEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || data.response || data.answer || 'I understand your question. Let me provide some insights...',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again in a moment.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput("Tell me about sustainable farming practices for small farms");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m AgriSense AI Assistant. I can help you with crop recommendations, weather analysis, farming tips, and more. How can I assist you today?',
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                  AgriChat
                </h1>
                <p className="text-gray-600 text-sm">Your AI Farming Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-gray-600 hover:text-emerald-600 hover:border-emerald-300"
              >
                Clear Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Questions Bar */}
      {messages.length <= 2 && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shrink-0">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">Quick Start Questions:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="whitespace-nowrap bg-white/80 hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 text-xs px-3 py-2 h-auto border border-gray-200 rounded-xl transition-all duration-200 hover:shadow-md flex-shrink-0"
                >
                  <Leaf className="w-3 h-3 mr-2 text-emerald-600" />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Container - Proper Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                    : 'bg-gradient-to-br from-emerald-500 to-green-600'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-[80%] space-y-2 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-5 py-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-lg'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <div className={`flex items-center gap-2 text-xs text-gray-500 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <Clock className="w-3 h-3" />
                  {formatTime(message.timestamp)}
                  {message.role === 'assistant' && (
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      AgriSense AI
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-lg max-w-md">
                <div className="flex items-center gap-3 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium">AgriSense AI is thinking...</div>
                    <div className="text-xs text-gray-500">Analyzing your farming question</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} className="h-1" />
          
          {/* Bottom padding to prevent content overlap with input */}
          <div className="h-12" />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="bg-gradient-to-t from-white via-white to-white/95 pt-6 pb-6 px-6 border-t border-gray-200/50 backdrop-blur-sm shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            {/* Voice Input Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVoiceInput}
              className={`h-14 w-14 rounded-2xl border-2 ${
                isListening 
                  ? 'border-red-300 bg-red-50 text-red-600' 
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
              } transition-all duration-200 flex-shrink-0`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            {/* Text Input */}
            <div className="flex-1 bg-white rounded-2xl border-2 border-gray-200 shadow-xl hover:border-emerald-300 focus-within:border-emerald-500 transition-colors duration-200">
              <textarea
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, weather, soil health, irrigation, pests, or any farming topic..."
                className="w-full border-0 focus:outline-none focus:ring-0 py-4 px-5 text-base h-auto min-h-[56px] max-h-32 resize-none rounded-2xl placeholder-gray-500"
                disabled={isLoading}
                rows={1}
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-14 w-14 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Input Footer */}
          <div className="flex justify-between items-center mt-3 px-1">
            <p className="text-xs text-gray-500">
              Press Enter to send • Shift+Enter for new line
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              {isLoading ? 'Processing...' : 'AgriSense AI is online'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}